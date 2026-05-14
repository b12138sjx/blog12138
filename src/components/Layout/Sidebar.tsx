'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: '文章', icon: '📝' },
  { href: '/graph', label: '图谱', icon: '🕸' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border)]
        transition-all duration-200
        ${collapsed ? 'w-12' : 'w-56'}
      `}
    >
      {/* Logo / title */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-[var(--border)]">
        {!collapsed && (
          <Link href="/" className="text-[var(--text-primary)] font-semibold text-sm truncate">
            🌱 Digital Garden
          </Link>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {navLinks.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-2 px-3 py-2 mx-1 my-0.5 rounded text-sm transition-colors
                ${active
                  ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              <span className="text-base flex-shrink-0">{icon}</span>
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer hint */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
          <kbd className="px-1 py-0.5 bg-[var(--bg-tertiary)] rounded text-[10px]">⌘K</kbd>
          {' '}搜索
        </div>
      )}
    </aside>
  )
}
