import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
}

export interface Post extends PostMeta {
  content: string
  /** 该文章引用了哪些 slug */
  links: string[]
  /** 哪些文章引用了该文章（反向链接） */
  backlinks: PostMeta[]
}

// ── 解析文章中的 [[wikilink]] ──────────────────────────────────────────────
function extractWikiLinks(content: string): string[] {
  const regex = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g
  const links: string[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim())
  }
  return [...new Set(links)]
}

// ── 读取单篇文章（不含 backlinks，避免循环依赖） ────────────────────────────
function readPost(filename: string): Omit<Post, 'backlinks'> {
  const slug = filename.replace(/\.mdx?$/, '')
  const filePath = path.join(CONTENT_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? String(data.date).slice(0, 10) : '',
    tags: data.tags ?? [],
    description: data.description ?? '',
    content,
    links: extractWikiLinks(content),
  }
}

// ── 获取所有文章（含反向链接） ─────────────────────────────────────────────
export function getAllPosts(): Post[] {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => /\.mdx?$/.test(f))
  const postsWithoutBacklinks = files.map(readPost)

  // 构建反向链接 map：slug → 引用它的文章 meta 列表
  const backlinkMap = new Map<string, PostMeta[]>()
  for (const post of postsWithoutBacklinks) {
    for (const linkedSlug of post.links) {
      if (!backlinkMap.has(linkedSlug)) backlinkMap.set(linkedSlug, [])
      backlinkMap.get(linkedSlug)!.push({
        slug: post.slug,
        title: post.title,
        date: post.date,
        tags: post.tags,
        description: post.description,
      })
    }
  }

  return postsWithoutBacklinks
    .map(post => ({
      ...post,
      backlinks: backlinkMap.get(post.slug) ?? [],
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

// ── 获取单篇文章 ───────────────────────────────────────────────────────────
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find(p => p.slug === slug)
}

// ── 获取所有 slug（用于 generateStaticParams） ─────────────────────────────
export function getAllSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter(f => /\.mdx?$/.test(f))
    .map(f => f.replace(/\.mdx?$/, ''))
}

// ── 获取所有标签 ───────────────────────────────────────────────────────────
export function getAllTags(): Record<string, number> {
  const posts = getAllPosts()
  const tags: Record<string, number> = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      tags[tag] = (tags[tag] ?? 0) + 1
    }
  }
  return tags
}

// ── 获取指定标签的文章 ─────────────────────────────────────────────────────
export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter(p => p.tags.includes(tag))
}
