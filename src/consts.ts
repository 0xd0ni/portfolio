import type { IconDef, IconMap, SocialLink, Site } from '@/types'
// central configuration file
export const SITE: Site = {
  title: 'doni at interweb',
  description:
    "fragments of ideas, stills, and moments I find worth keeping. A mix of visual work, experiments, and software projects that reflect how I think and build. My name's Allan aka doni",
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
    label: 'gallery',
  },
  {
    href: '/uses',
    label: 'uses',
  },
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
  // social
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',

  // languages
  c: { icon: 'simple-icons:c', color: '#A8B9CC' },
  cplusplus: { icon: 'simple-icons:cplusplus', color: '#00599C' },
  go: { icon: 'simple-icons:go', color: '#00ADD8' },
  html: { icon: 'simple-icons:html5', color: '#E34F26' },
  java: { icon: 'lucide:coffee', color: '#F8981D' },
  julia: { icon: 'simple-icons:julia', color: '#9558B2' },
  lua: { icon: 'simple-icons:lua', color: '#2C2D72' },
  python: { icon: 'simple-icons:python', color: '#3776AB' },
  typescript: { icon: 'simple-icons:typescript', color: '#3178C6' },

  // frameworks & libraries
  astro: { icon: 'simple-icons:astro', color: '#FF5D01' },
  'elk.js': { icon: 'lucide:network', color: '#888888' },
  fastapi: { icon: 'simple-icons:fastapi', color: '#009688' },
  gson: { icon: 'simple-icons:google', color: '#4285F4' },
  maven: { icon: 'simple-icons:apachemaven', color: '#C71A36' },
  react: { icon: 'simple-icons:react', color: '#61DAFB' },
  shadcn: { icon: 'simple-icons:shadcnui', color: '#888888' },
  tailwind: { icon: 'simple-icons:tailwindcss', color: '#06B6D4' },
  vue: { icon: 'simple-icons:vuedotjs', color: '#4FC08D' },
  vueflow: { icon: 'lucide:workflow', color: '#4FC08D' },

  // databases
  mongodb: { icon: 'simple-icons:mongodb', color: '#47A248' },

  // infrastructure & services
  'cloudflare pages': { icon: 'simple-icons:cloudflare', color: '#F6821F' },
  openrouter: { icon: 'simple-icons:openrouter', color: '#888888' },
  r2: { icon: 'simple-icons:cloudflare', color: '#F6821F' },
  render: { icon: 'simple-icons:render', color: '#4351E8' },
  rss: { icon: 'lucide:rss', color: '#F26522' },
  vagrant: { icon: 'simple-icons:vagrant', color: '#1868F2' },
}

export function getIconName(icon: IconDef | undefined): string | undefined {
  if (!icon) return undefined
  return typeof icon === 'string' ? icon : icon.icon
}

export function getIconColor(icon: IconDef | undefined): string | undefined {
  if (!icon || typeof icon === 'string') return undefined
  return icon.color
}
