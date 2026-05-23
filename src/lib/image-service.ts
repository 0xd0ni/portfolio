import type { ImageOutputFormat, LocalImageService } from 'astro'
import sharpService from 'astro/assets/services/sharp'
import { createHash } from 'node:crypto'
import { r2 } from './r2'

type SharpTransformParams = Parameters<typeof sharpService.transform>

const MIME: Record<string, string> = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
}

function cacheKey(transform: SharpTransformParams[1]): string {
  const { src, format, width, height, quality, fit, position, background } =
    transform
  const hash = createHash('sha256')
    .update(
      JSON.stringify({
        src,
        format,
        width,
        height,
        quality,
        fit,
        position,
        background,
      }),
    )
    .digest('hex')
    .slice(0, 24)
  return `_cache/${hash}.${format ?? 'bin'}`
}

export default {
  ...sharpService,
  transform: async (
    inputBuffer: SharpTransformParams[0],
    transform: SharpTransformParams[1],
    config: SharpTransformParams[2],
  ) => {
    const key = cacheKey(transform)

    const cached = await r2.get(key).catch(() => null)
    if (cached) {
      return { data: cached, format: transform.format as ImageOutputFormat }
    }

    const result = await sharpService.transform(inputBuffer, transform, config)

    r2.put(
      key,
      result.data,
      MIME[result.format] ?? 'application/octet-stream',
    ).catch((err) =>
      console.warn('[image-service] R2 cache write failed:', err),
    )

    return result
  },
} satisfies LocalImageService
