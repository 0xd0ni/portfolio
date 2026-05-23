import { getCollection, type CollectionEntry } from 'astro:content'
import { readFileSync } from 'node:fs'
import { parse } from 'smol-toml'

export interface AlbumMeta {
  name: string
  pubDate: string
  cover?: string
}

export interface Album {
  name: string
  pubDate: Date
  cover: string
  coverAlt: string
  count: number
}

export function readAlbumsMeta(): AlbumMeta[] {
  const { albums } = parse(
    readFileSync('./src/content/gallery/albums.toml', 'utf-8'),
  ) as { albums: { name: string; pubDate: string; cover?: string }[] }
  return albums
}

async function loadAlbumMap(): Promise<
  Map<string, CollectionEntry<'albums'>[]>
> {
  const entries = await getCollection('albums')
  const map = new Map<string, CollectionEntry<'albums'>[]>()
  for (const entry of entries) {
    const name = entry.data.album
    if (!map.has(name)) map.set(name, [])
    map.get(name)!.push(entry)
  }
  return map
}

export async function getAlbums(): Promise<Album[]> {
  const albumMap = await loadAlbumMap()
  const meta = readAlbumsMeta()
  const coverOverride = new Map(
    meta.filter((a) => a.cover).map((a) => [a.name, a.cover!]),
  )

  return [...albumMap.entries()]
    .map(([name, photos]) => {
      const specified = coverOverride.get(name)
      const cover =
        (specified && photos.find((p) => p.data.title === specified)) ||
        photos[0]
      return {
        name,
        pubDate: photos[0].data.pubDate,
        cover: cover.data.cover,
        coverAlt: cover.data.coverAlt,
        count: photos.length,
      }
    })
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
}

export async function getAlbumPaths(): Promise<
  { params: { id: string }; props: { photos: string[] } }[]
> {
  const albumMap = await loadAlbumMap()
  return [...albumMap.entries()].map(([name, photos]) => ({
    params: { id: name },
    props: { photos: photos.map((p) => p.data.cover) },
  }))
}
