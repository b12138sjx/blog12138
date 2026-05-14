import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostsByTag, getAllTags } from '@/lib/posts'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return Object.keys(tags).map(tag => ({ tag: encodeURIComponent(tag) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  return { title: `#${decoded}` }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const posts = getPostsByTag(decoded)

  if (posts.length === 0) notFound()

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">首页</Link>
          <span>/</span>
          <span>标签</span>
          <span>/</span>
          <span>{decoded}</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          # {decoded}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {posts.length} 篇文章
        </p>
      </div>

      <ul className="space-y-1">
        {posts.map(post => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="flex items-start gap-4 px-3 py-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors group"
            >
              <time className="text-xs text-[var(--text-muted)] mt-1 flex-shrink-0 w-24">
                {post.date}
              </time>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                  {post.title}
                </div>
                {post.description && (
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {post.description}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
