import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { r2Loader } from '@/content/config'
import { readAlbumsMeta } from '@/lib/albums'
import { z } from 'astro/zod'

const albumEntries = readAlbumsMeta()
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
    github: z.url().optional(),
    linkedin: z.url().optional(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    link: z.url().optional(),
    watchDemoLink: z.url().optional(),
    seeDemoLink: z.url().optional(),
    readLink: z.url().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
})

const albums = defineCollection({
  loader: r2Loader(albumEntries),
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
