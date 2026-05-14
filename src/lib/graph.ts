import { getAllPosts } from './posts'

export interface GraphNode {
  id: string
  name: string
  val: number   // 节点大小（由连接数决定）
  tags: string[]
  description: string
}

export interface GraphLink {
  source: string
  target: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export function buildGraphData(): GraphData {
  const posts = getAllPosts()

  // 构建有效 slug 集合，过滤掉悬空链接
  const slugSet = new Set(posts.map(p => p.slug))

  // 计算每个节点的连接度（入度 + 出度）
  const degree = new Map<string, number>()
  for (const post of posts) {
    degree.set(post.slug, (degree.get(post.slug) ?? 0))
    for (const link of post.links) {
      if (slugSet.has(link)) {
        degree.set(post.slug, (degree.get(post.slug) ?? 0) + 1)
        degree.set(link, (degree.get(link) ?? 0) + 1)
      }
    }
  }

  const nodes: GraphNode[] = posts.map(post => ({
    id: post.slug,
    name: post.title,
    val: Math.max(1, degree.get(post.slug) ?? 1),
    tags: post.tags,
    description: post.description,
  }))

  const links: GraphLink[] = []
  const seen = new Set<string>()

  for (const post of posts) {
    for (const target of post.links) {
      if (!slugSet.has(target)) continue
      const key = [post.slug, target].sort().join('→')
      if (seen.has(key)) continue
      seen.add(key)
      links.push({ source: post.slug, target })
    }
  }

  return { nodes, links }
}
