'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import type { GraphData, GraphNode } from '@/lib/graph'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false }) as any

interface KnowledgeGraphProps {
  data: GraphData
}

const TAG_COLORS: Record<string, string> = {
  'react': '#61dafb',
  'nextjs': '#c8d3f5',
  '前端': '#f7df1e',
  'javascript': '#f7df1e',
  '介绍': '#a78bfa',
  '博客': '#a78bfa',
  '资源': '#34d399',
  '学习': '#34d399',
}

function getNodeColor(node: GraphNode): string {
  for (const tag of node.tags) {
    if (TAG_COLORS[tag]) return TAG_COLORS[tag]
  }
  return '#7c8a99'
}

export default function KnowledgeGraph({ data }: KnowledgeGraphProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // 用 ResizeObserver 精确测量容器尺寸
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width: Math.floor(width), height: Math.floor(height) })
      }
    })
    ro.observe(el)
    setDimensions({
      width: Math.floor(el.clientWidth),
      height: Math.floor(el.clientHeight),
    })
    return () => ro.disconnect()
  }, [])

  // 使用 callback ref 捕获图实例，在挂载后立即 zoomToFit
  const setGraphRef = useCallback((instance: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    graphRef.current = instance
    if (instance) {
      // warmupTicks=100 约需几十ms，给足 1.5s 确保 simulate 稳定后再 fit
      setTimeout(() => instance.zoomToFit(600, 48), 1500)
    }
  }, [])

  // 为节点预设初始坐标（world 坐标系原点附近均布）
  // 注意：不能用 CSS 像素作为 world 坐标，否则 zoomToFit 会偏移
  const graphDataPositioned = useMemo(() => {
    if (dimensions.width === 0) return data
    const n = data.nodes.length
    const r = 20 // world 单位，力模拟从原点向外扩散
    return {
      links: data.links,
      nodes: data.nodes.map((node, i) => ({
        ...node,
        x: r * Math.cos((2 * Math.PI * i) / Math.max(n, 1)),
        y: r * Math.sin((2 * Math.PI * i) / Math.max(n, 1)),
      })),
    }
  }, [data, dimensions.width]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNodeClick = useCallback(
    (node: GraphNode) => router.push(`/posts/${node.id}`),
    [router]
  )

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node)
    document.body.style.cursor = node ? 'pointer' : 'default'
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={setGraphRef}
          graphData={graphDataPositioned}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="transparent"
          nodeLabel=""
          nodeVal={(node: GraphNode) => Math.max(1, node.val)}
          nodeColor={(node: GraphNode) => getNodeColor(node)}
          nodeCanvasObject={(node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const label = node.name
            const fontSize = Math.max(3, 12 / globalScale)
            const r = Math.max(3, (node.val ?? 1) * 1.2)

            if (node === hoveredNode) {
              ctx.beginPath()
              ctx.arc(node.x!, node.y!, r + 3, 0, 2 * Math.PI)
              ctx.fillStyle = 'rgba(167,139,250,0.25)'
              ctx.fill()
            }

            ctx.beginPath()
            ctx.arc(node.x!, node.y!, r, 0, 2 * Math.PI)
            ctx.fillStyle = node === hoveredNode ? '#cba6f7' : getNodeColor(node)
            ctx.fill()

            if (globalScale > 1) {
              ctx.font = `${fontSize}px -apple-system, sans-serif`
              ctx.fillStyle = 'rgba(205,214,244,0.9)'
              ctx.textAlign = 'center'
              ctx.fillText(label, node.x!, node.y! + r + fontSize)
            }
          }}
          linkColor={() => 'rgba(124,138,153,0.3)'}
          linkWidth={1.2}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          warmupTicks={80}
          cooldownTicks={0}
          onEngineStop={() => graphRef.current?.zoomToFit(600, 48)}
        />
      )}

      {/* 悬停预览卡片 */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 w-56 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 shadow-xl pointer-events-none">
          <div className="text-sm font-medium text-[var(--text-primary)]">{hoveredNode.name}</div>
          {hoveredNode.description && (
            <div className="text-xs text-[var(--text-muted)] mt-1 line-clamp-3">
              {hoveredNode.description}
            </div>
          )}
          {hoveredNode.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hoveredNode.tags.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="text-[10px] text-[var(--accent)] mt-2">点击打开文章 →</div>
        </div>
      )}
    </div>
  )
}
