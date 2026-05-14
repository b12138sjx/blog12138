import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

interface BacklinksProps {
  backlinks: PostMeta[]
}

export default function Backlinks({ backlinks }: BacklinksProps) {
  if (backlinks.length === 0) return null

  return (
    <section className="mt-12 pt-6 border-t border-[var(--border)]">
      <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
        <span>🔗</span> 链接至此的文章
      </h2>
      <ul className="space-y-2">
        {backlinks.map(post => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="flex items-start gap-2 p-2 rounded-md hover:bg-[var(--bg-hover)] transition-colors group"
            >
              <span className="text-[var(--accent)] mt-0.5 text-sm">↩</span>
              <div>
                <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {post.title}
                </span>
                {post.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
