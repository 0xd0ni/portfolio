import { readFileSync } from 'node:fs'
import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { r2Loader } from '@/content/config'
import { z } from 'astro/zod'
import { parse } from 'smol-toml'

const { albums: albumEntries } = parse(
  readFileSync('./src/content/gallery/albums.toml', 'utf-8'),
) as { albums: { name: string; pubDate: string }[] }

const albumPrefixes = albumEntries.map((a) => a.name)

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      order: z.number().optional(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    }),
})

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    pronouns: z.string().optional(),
    avatar: z.url().or(z.string().startsWith('/')),
    bio: z.string().optional(),
    mail: z.email().optional(),
    website: z.url().optional(),
    twitter: z.url().optional(),
    github: z.url().optional(),
    linkedin: z.url().optional(),
    discord: z.url().optional(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      image: image(),
      link: z.url(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
    }),
})

const albums = defineCollection({
  loader: r2Loader(albumPrefixes),
  schema: z.object({
    title: z.string(),
    album: z.string(),
    description: z.string(),
    pubDate: z.date(),
    cover: z.string(),
    coverAlt: z.string(),
  }),
})

export const collections = { blog, authors, projects, albums }
