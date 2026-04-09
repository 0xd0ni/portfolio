export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  featuredPostCount: number
  postsPerPage: number
}

export type IconDef = string | { icon: string; color: string }

export type SocialLink = {
  href: string
  label: string
}

export type IconMap = {
  [key: string]: IconDef
}
