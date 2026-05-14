import Link from 'next/link'
import { getAllPosts, getAllTags } from '@/lib/posts'

export default function HomePage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  const topTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          🌱 Digital Garden
        </h1>
        <p className="text-[var(--text-secondary)]">
          {posts.length} 篇文章 · 思考与知识的连接网络
        </p>
      </div>

      {/* 标签云 */}
      {topTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            标签
          </h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {tag}
                <span className="text-xs text-[var(--text-muted)]">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 文章列表 */}
      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
          最近文章
        </h2>
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
                  {post.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {post.backlinks.length > 0 && (
                  <span className="text-xs text-[var(--text-muted)] flex-shrink-0 mt-1">
                    ↩ {post.backlinks.length}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
