import type { Loader } from 'astro/loaders'
import { r2 } from '@/lib/r2'

export function r2Loader(prefixes: string | string[]): Loader {
  const prefixList = Array.isArray(prefixes) ? prefixes : [prefixes]

  return {
    name: 'r2-loader',
    load: async ({ store, logger, parseData }) => {
      store.clear()

      for (const prefix of prefixList) {
        logger.info(`Fetching images from R2 with prefix: ${prefix}`)

        let continuationToken: string | undefined

        do {
          const result = await r2.list({ prefix, continuationToken })

          for (const obj of result.contents ?? []) {
            if (!obj.key.match(/\.(jpg|jpeg|png|webp|avif)$/i)) continue

            // Use the full key as the id to avoid collisions across prefixes
            const id = obj.key
            const publicUrl = `${import.meta.env.R2_PUBLIC_DOMAIN}${obj.key}`
            const title = obj.key.split('/').pop()?.split('.')[0] ?? 'Untitled'

            const data = await parseData({
              id,
              data: {
                title,
                album: prefix,
                description: `Image from ${prefix}`,
                cover: publicUrl,
                coverAlt: title,
                pubDate: obj.lastModified ?? new Date(),
              },
            })

            store.set({ id, data })
          }

          continuationToken = result.isTruncated
            ? result.nextContinuationToken
            : undefined
        } while (continuationToken)
      }

      logger.info(`Done loading images from R2`)
    },
  } satisfies Loader
}
