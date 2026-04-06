import type { IconMap, SocialLink, Site } from '@/types'
// central configuration file
export const SITE: Site = {
  title: 'doni at interweb',
  description:
    'fragments of ideas, stills, and moments I find worth keeping. A mix of visual work, experiments, and software projects that reflect how I think and build. My name\'s Allan aka doni',
  href: 'https://doniatinterweb.pages.dev',
  author: 'doni',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/about',
    label: 'about',
  },
  {
    href: '/gallery',
    label: 'gallery'
  },
  {
    href: '/uses',
    label: 'uses'
  }
  
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: `https://github.com/${import.meta.env.PUBLIC_GITHUB}`,
    label: 'GitHub',
  },
  {
    href: `https://www.linkedin.com/in/${import.meta.env.PUBLIC_LINKEDIN}`,
    label: 'LinkedIn',
  },
  {
    href: `mailto:${import.meta.env.PUBLIC_EMAIL}`,
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
