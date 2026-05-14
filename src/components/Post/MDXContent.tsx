import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

interface MDXContentProps {
  content: string
  /** 所有有效的文章 slug，用于 wikilink 渲染 */
  slugs: string[]
}

/** wikilink [[slug]] → <Link> 的自定义组件 */
function WikiLink({ href, children }: { href?: string; children?: React.ReactNode }) {
  if (!href) return <span>{children}</span>
  return (
    <Link
      href={href}
      className="wikilink text-[var(--accent)] border-b border-[var(--accent)]/40 hover:border-[var(--accent)] transition-colors"
    >
      {children}
    </Link>
  )
}

const mdxComponents = {
  // rehype-pretty-code 会接管 pre/code，这里不需要覆盖
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith('/')) {
      return <Link href={href} {...(props as object)}>{children}</Link>
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  },
}

export default function MDXContent({ content, slugs }: MDXContentProps) {
  return (
    <div className="prose prose-obsidian max-w-none">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,
              [
                remarkWikiLink,
                {
                  pageResolver: (name: string) => [name.toLowerCase().replace(/\s+/g, '-')],
                  hrefTemplate: (permalink: string) => `/posts/${permalink}`,
                  aliasDivider: '|',
                  wikiLinkClassName: 'wikilink',
                  newClassName: 'wikilink-new',
                },
              ],
            ],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              [
                rehypePrettyCode,
                {
                  theme: 'github-dark',
                  keepBackground: true,
                },
              ],
            ],
          },
        }}
        components={mdxComponents}
      />
    </div>
  )
}
