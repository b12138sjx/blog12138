import { buildGraphData } from '@/lib/graph'
import KnowledgeGraph from '@/components/Graph/KnowledgeGraph'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '知识图谱' }

export default function GraphPage() {
  const graphData = buildGraphData()

  return (
    // 撑满 main（main 是 flex-1，这里用 h-full + flex-col）
    <div className="h-full flex flex-col overflow-hidden">
      {/* 顶部标题栏 */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-[var(--text-primary)]">🕸 知识图谱</h1>
          <p className="text-xs text-[var(--text-muted)]">
            {graphData.nodes.length} 篇文章 · {graphData.links.length} 条连接 · 点击节点打开文章
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#cba6f7] inline-block" />
            <span>文章节点</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 border-t border-[var(--text-muted)]" />
            <span>引用关系</span>
          </span>
        </div>
      </div>

      {/* 图谱区域：flex-1 让它占满剩余高度 */}
      <div className="flex-1 min-h-0">
        <KnowledgeGraph data={graphData} />
      </div>
    </div>
  )
}
