import { useEffect, useRef, useState } from 'react'
import { Loader2, Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search terminology...',
  debounceMs = 300,
  showClear = true,
  isLoading = false,
  className,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [isFocused, setIsFocused] = useState(false)
  // Tracks the last external searchTerm we've synced from, so an external
  // reset (e.g. a "clear filters" action elsewhere) is picked up without
  // needing an effect to mirror the prop into local state.
  const [syncedSearchTerm, setSyncedSearchTerm] = useState(searchTerm)

  const inputRef = useRef(null)
  const debounceTimeoutRef = useRef(null)

  if (searchTerm !== syncedSearchTerm) {
    setSyncedSearchTerm(searchTerm)
    setLocalSearchTerm(searchTerm)
  }

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (debounceMs > 0) {
      debounceTimeoutRef.current = setTimeout(() => {
        onSearchChange(localSearchTerm)
      }, debounceMs)
    } else {
      onSearchChange(localSearchTerm)
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [localSearchTerm, debounceMs, onSearchChange])

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  const handleClearSearch = () => {
    setLocalSearchTerm('')
    onSearchChange('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Escape':
        if (localSearchTerm) {
          event.preventDefault()
          handleClearSearch()
        } else {
          inputRef.current?.blur()
        }
        break
      case 'Enter':
        if (debounceMs > 0) {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
          }
          onSearchChange(localSearchTerm)
        }
        break
      default:
        break
    }
  }

  return (
    <div className={cn('relative mx-auto w-full max-w-2xl', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isLoading ? (
          <Loader2 className="size-4 animate-spin text-primary/60" aria-hidden="true" />
        ) : (
          <Search className="size-4 text-foreground/50" aria-hidden="true" />
        )}
      </div>

      <Input
        ref={inputRef}
        type="text"
        value={localSearchTerm}
        onChange={(event) => setLocalSearchTerm(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn('h-auto py-3 pl-10 pr-20 text-base', isFocused && 'shadow-lg shadow-primary/10')}
        aria-label="Search input"
        aria-describedby="search-description"
      />

      {showClear && localSearchTerm && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleClearSearch}
          className="absolute inset-y-0 right-2 my-auto"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </Button>
      )}

      {!localSearchTerm && !isFocused && (
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <kbd className="inline-flex items-center rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground/50">
            {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </div>
      )}

      <div id="search-description" className="sr-only">
        Search terminology. Use Escape to clear search or Ctrl+K to focus search field.
      </div>
    </div>
  )
}
