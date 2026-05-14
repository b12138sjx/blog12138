'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchItem } from '@/lib/search'

interface SearchModalProps {
  open: boolean
  onClose: () => void
  items: SearchItem[]
}

export default function SearchModal({ open, onClose, items }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // 简单的客户端模糊搜索（无需加载 FlexSearch bundle 也足够）
  useEffect(() => {
    if (!query.trim()) {
      setResults(items.slice(0, 8))
      setActiveIdx(0)
      return
    }
    const q = query.toLowerCase()
    const matched = items.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        item.text.toLowerCase().includes(q)
    )
    setResults(matched.slice(0, 8))
    setActiveIdx(0)
  }, [query, items])

  // 聚焦 input
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [open])

  const navigate = useCallback(
    (slug: string) => {
      router.push(`/posts/${slug}`)
      onClose()
    },
    [router, onClose]
  )

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIdx]) {
      navigate(results[activeIdx].slug)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-[var(--bg-secondary)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <span className="text-[var(--text-muted)] text-sm">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索文章标题、标签、内容…"
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm outline-none"
          />
          <kbd className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <ul className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
              没有找到相关文章
            </li>
          ) : (
            results.map((item, i) => (
              <li key={item.slug}>
                <button
                  className={`
                    w-full text-left px-4 py-2.5 transition-colors
                    ${i === activeIdx ? 'bg-[var(--accent-muted)]' : 'hover:bg-[var(--bg-hover)]'}
                  `}
                  onClick={() => navigate(item.slug)}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <div className="text-sm text-[var(--text-primary)] font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                      {item.description}
                    </div>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--border)] flex gap-4 text-[10px] text-[var(--text-muted)]">
          <span><kbd className="bg-[var(--bg-tertiary)] px-1 rounded">↑↓</kbd> 选择</span>
          <span><kbd className="bg-[var(--bg-tertiary)] px-1 rounded">↵</kbd> 打开</span>
          <span><kbd className="bg-[var(--bg-tertiary)] px-1 rounded">ESC</kbd> 关闭</span>
        </div>
      </div>
    </div>
  )
}
