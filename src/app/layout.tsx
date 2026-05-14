import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Layout/Sidebar'
import ThemeToggle from '@/components/Layout/ThemeToggle'
import SearchProvider from '@/components/Search/SearchProvider'
import { buildSearchIndex } from '@/lib/search'

export const metadata: Metadata = {
  title: {
    default: 'Digital Garden',
    template: '%s · Digital Garden',
  },
  description: '一个 Obsidian 风格的数字花园，记录思考与知识',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchItems = buildSearchIndex()

  return (
    <html lang="zh-CN" className="dark h-full">
      <body className="h-full flex bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <SearchProvider items={searchItems}>
          {/* 左侧边栏 */}
          <Sidebar />

          {/* 主区域 */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* 顶部 header */}
            <header className="flex items-center justify-end gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <ThemeToggle />
            </header>

            {/* 页面内容：min-h-0 确保 flex 子项可以正确收缩 */}
            <main className="flex-1 min-h-0 overflow-y-auto">
              {children}
            </main>
          </div>
        </SearchProvider>
      </body>
    </html>
  )
}
