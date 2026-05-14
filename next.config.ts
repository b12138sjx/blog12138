import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 使用空 turbopack 配置以消除警告（Turbopack 默认已处理 fs/path 的 fallback）
  turbopack: {},
}

export default nextConfig
