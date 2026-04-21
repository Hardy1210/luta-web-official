export type NavItem = {
  label: string
  href: string
  external?: boolean
}

export type SeoProps = {
  title: string
  description: string
  canonical?: string
  ogImage?: string
}

export type BaseProps = {
  className?: string
  children?: React.ReactNode
}
