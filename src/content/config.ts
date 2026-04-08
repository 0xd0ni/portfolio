import type { Loader } from 'astro/loaders'
import { readFileSync } from 'node:fs'
import { parse } from 'smol-toml'
import { r2 } from '@/lib/r2'

const { albums: albumEntries } = parse(
  readFileSync('./src/content/gallery/albums.toml', 'utf-8'),
) as { albums: { name: string; pubDate: string }[] }

// album dates are defined in toml
const albumDates: Record<string, Date> = Object.fromEntries(
  albumEntries.map((a) => [a.name, new Date(a.pubDate)]),
)

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
            if (!obj.key.match(/\.(avif)$/i)) continue

            // Use the full key as the id to avoid collisions across prefixes
            const id = obj.key
            const publicUrl = `${import.meta.env.R2_CUSTOM_DOMAIN}${obj.key}`
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

      logger.info(`Done loading images from R2`)
    },
  } satisfies Loader
}
