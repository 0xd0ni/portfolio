import type { Loader } from 'astro/loaders'
import type { AlbumMeta } from '@/lib/albums'
import { buildImageUrl, r2 } from '@/lib/r2'

export function r2Loader(albums: AlbumMeta[]): Loader {
  const albumDates = Object.fromEntries(
    albums.map((a) => [a.name, new Date(a.pubDate)]),
  )

  return {
    name: 'r2-loader',
    load: async ({ store, logger, parseData, meta }) => {
      const lastSyncedAt = meta.get('lastSyncedAt')
      const seenKeys = new Set<string>()

      for (const { name: prefix } of albums) {
        logger.info(`Fetching images from R2 with prefix: ${prefix}`)
        let continuationToken: string | undefined

        do {
          const result = await r2.list({ prefix, continuationToken })

          for (const obj of result.contents ?? []) {
            if (!obj.key.match(/\.(avif)$/i)) continue

            seenKeys.add(obj.key)

            // Skip if already in the store and unchanged since last sync
            if (
              lastSyncedAt &&
              obj.lastModified &&
              obj.lastModified <= new Date(lastSyncedAt) &&
              store.has(obj.key)
            ) {
              continue
            }

            const id = obj.key
            const publicUrl = buildImageUrl(obj.key)
            const title = obj.key.split('/').pop()?.split('.')[0] ?? 'Untitled'

            const data = await parseData({
              id,
              data: {
                title,
                album: prefix,
                description: `Image from ${prefix}`,
                cover: publicUrl,
                coverAlt: title,
                pubDate: albumDates[prefix] ?? obj.lastModified ?? new Date(),
              },
            })

            store.set({ id, data })
          }

          continuationToken = result.isTruncated
            ? result.nextContinuationToken
            : undefined
        } while (continuationToken)
      }

      // Remove entries for images deleted from R2
      for (const id of store.keys()) {
        if (!seenKeys.has(id)) {
          store.delete(id)
        }
      }

      meta.set('lastSyncedAt', new Date().toISOString())
      logger.info(`Done loading images from R2`)
    },
  } satisfies Loader
}
