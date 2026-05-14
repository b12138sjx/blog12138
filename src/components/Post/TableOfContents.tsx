import Link from 'next/link'

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface TocProps {
  headings: TableOfContentsItem[]
}

export default function TableOfContents({ headings }: TocProps) {
  if (headings.length === 0) return null

  return (
    <nav className="sticky top-6">
      <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
        目录
      </h3>
      <ul className="space-y-1">
        {headings.map(h => (
          <li
            key={h.id}
            style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
          >
            <a
              href={`#${h.id}`}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors line-clamp-2 block py-0.5"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** 从 MDX 原始内容中提取标题 */
export function extractHeadings(content: string): TableOfContentsItem[] {
  const regex = /^(#{1,6})\s+(.+)$/gm
  const headings: TableOfContentsItem[] = []
  let match

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].replace(/\*\*|__|\*|_|`/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w一-龥\s-]/g, '')
      .replace(/\s+/g, '-')
    headings.push({ id, text, level })
  }

  return headings
}
