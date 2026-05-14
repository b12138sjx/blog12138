import { getAllPosts } from './posts'

export interface SearchItem {
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
  /** 纯文本内容（用于全文搜索） */
  text: string
}

/** 构建供前端 FlexSearch 使用的搜索索引数据 */
export function buildSearchIndex(): SearchItem[] {
  return getAllPosts().map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
    date: post.date,
    // 去除 MDX/Markdown 标记，保留纯文字
    text: post.content
      .replace(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, '$1') // wikilink
      .replace(/```[\s\S]*?```/g, '')                    // 代码块
      .replace(/`[^`]+`/g, '')                           // 行内代码
      .replace(/[#*_~>\-|]/g, '')                        // markdown 符号
      .replace(/https?:\/\/\S+/g, '')                    // 链接
      .replace(/\s+/g, ' ')
      .trim(),
  }))
}
