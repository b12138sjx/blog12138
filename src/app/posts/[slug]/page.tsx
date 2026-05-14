import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllSlugs, getPostBySlug, getAllPosts } from '@/lib/posts'
import MDXContent from '@/components/Post/MDXContent'
import Backlinks from '@/components/Post/Backlinks'
import TableOfContents, { extractHeadings } from '@/components/Post/TableOfContents'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allSlugs = getAllSlugs()
  const headings = extractHeadings(post.content)

  return (
    <div className="flex gap-8 max-w-5xl mx-auto px-6 py-10 w-full">
      {/* 文章主体 */}
      <article className="flex-1 min-w-0">
        {/* 元信息 */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">首页</Link>
            <span>/</span>
            <span>{post.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <time className="text-xs text-[var(--text-muted)]">{post.date}</time>
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          {post.description && (
            <p className="mt-3 text-sm text-[var(--text-secondary)] italic border-l-2 border-[var(--accent)] pl-3">
              {post.description}
            </p>
          )}
        </header>

        {/* MDX 正文 */}
        <MDXContent content={post.content} slugs={allSlugs} />

        {/* 反向链接 */}
        <Backlinks backlinks={post.backlinks} />
      </article>

      {/* 右侧目录 */}
      {headings.length > 0 && (
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <TableOfContents headings={headings} />
        </aside>
      )}
    </div>
  )
}
