'use client'

import { useEffect, useState } from 'react'
import SearchModal from '@/components/Search/SearchModal'
import type { SearchItem } from '@/lib/search'

interface SearchProviderProps {
  children: React.ReactNode
  items: SearchItem[]
}

export default function SearchProvider({ children, items }: SearchProviderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {children}
      <SearchModal open={open} onClose={() => setOpen(false)} items={items} />
    </>
  )
}
