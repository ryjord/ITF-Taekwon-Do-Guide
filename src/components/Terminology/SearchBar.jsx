import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

/**
 * SearchBar Component
 * 
 * Professional search input component with advanced features including
 * clear functionality, keyboard shortcuts, and accessibility compliance.
 * 
 * Features:
 * - Clear search functionality with visual feedback
 * - Keyboard shortcuts (Escape to clear, Ctrl+K/Cmd+K to focus)
 * - Loading states and search indicators
 * - Accessibility-compliant with ARIA labels
 * - Professional styling with smooth transitions
 * - Customizable placeholder and debounced search
 * 
 * @param {Object} props - Component properties
 * @param {string} props.searchTerm - Current search term value
 * @param {Function} props.onSearchChange - Callback when search term changes
 * @param {string} [props.placeholder='Search terminology...'] - Input placeholder text
 * @param {number} [props.debounceMs=300] - Debounce delay for search (0 for immediate)
 * @param {boolean} [props.showClear=true] - Whether to show clear button
 * @param {boolean} [props.isLoading=false] - Loading state for search indicator
 * @param {string} [props.className] - Additional CSS classes for container
 * 
 * @returns {JSX.Element} Search bar component
 * 
 * @example
 * <SearchBar 
 *   searchTerm={searchTerm}
 *   onSearchChange={setSearchTerm}
 *   placeholder="Search techniques..."
 *   debounceMs={300}
 * />
 */
export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search terminology...",
  debounceMs = 300,
  showClear = true,
  isLoading = false,
  className 
}) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[string, Function]} Local search term for debouncing */
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  
  /** @type {[boolean, Function]} Focus state for styling */
  const [isFocused, setIsFocused] = useState(false)

  // ===== REFERENCES =====
  
  const inputRef = useRef(null)
  const debounceTimeoutRef = useRef(null)

  // ===== EFFECTS =====

  /**
   * Handles debounced search updates
   */
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set new timeout for debounced search
    if (debounceMs > 0) {
      debounceTimeoutRef.current = setTimeout(() => {
        onSearchChange(localSearchTerm)
      }, debounceMs)
    } else {
      // Immediate update if no debounce
      onSearchChange(localSearchTerm)
    }

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [localSearchTerm, debounceMs, onSearchChange])

  /**
   * Sync local state with external search term
   */
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  /**
   * Handles global keyboard shortcuts
   */
  useEffect(() => {
    /**
     * Handles keyboard shortcut to focus search
     * @param {KeyboardEvent} event - Keyboard event
     */
    const handleGlobalKeyDown = (event) => {
      // Ctrl+K or Cmd+K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

  // ===== EVENT HANDLERS =====

  /**
   * Handles input value changes
   * @param {React.ChangeEvent<HTMLInputElement>} event - Change event
   */
  const handleInputChange = (event) => {
    setLocalSearchTerm(event.target.value)
  }

  /**
   * Handles clear search action
   */
  const handleClearSearch = () => {
    setLocalSearchTerm('')
    onSearchChange('')
    inputRef.current?.focus()
  }

  /**
   * Handles input focus
   */
  const handleFocus = () => {
    setIsFocused(true)
  }

  /**
   * Handles input blur
   */
  const handleBlur = () => {
    setIsFocused(false)
  }

  /**
   * Handles keyboard events for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   */
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
        // Force immediate search on Enter
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

  // ===== RENDER METHODS =====

  /**
   * Renders search icon with loading state
   * @returns {JSX.Element} Search icon component
   */
  const renderSearchIcon = () => (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
      ) : (
        <svg 
          className="w-5 h-5 text-foreground/50 transition-colors duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      )}
    </div>
  )

  /**
   * Renders clear button when search has value
   * @returns {JSX.Element} Clear button component
   */
  const renderClearButton = () => (
    showClear && localSearchTerm && (
      <button
        onClick={handleClearSearch}
        className="
          absolute inset-y-0 right-0 pr-3 flex items-center
          text-foreground/50 hover:text-foreground transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md
        "
        aria-label="Clear search"
        type="button"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    )
  )

  /**
   * Renders keyboard shortcut hint
   * @returns {JSX.Element} Keyboard shortcut component
   */
  const renderShortcutHint = () => (
    !localSearchTerm && !isFocused && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <kbd className="
          inline-flex items-center px-2 py-1 rounded text-xs
          bg-muted text-foreground/50 border border-border
          font-mono font-medium
        ">
          {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </div>
    )
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      {/* Search Icon */}
      {renderSearchIcon()}
      
      {/* Search Input */}
      <input
        ref={inputRef}
        type="text"
        value={localSearchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          // Base styles
          "w-full pl-10 pr-20 py-3 bg-background border rounded-xl",
          "text-foreground placeholder-foreground/50 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          
          // Focus states
          isFocused 
            ? "border-primary/50 shadow-lg shadow-primary/10" 
            : "border-border hover:border-foreground/30",
            
          // Loading state
          isLoading && "pr-24"
        )}
        aria-label="Search input"
        aria-describedby="search-description"
      />
      
      {/* Clear Button */}
      {renderClearButton()}
      
      {/* Keyboard Shortcut Hint */}
      {renderShortcutHint()}
      
      {/* Accessibility Description */}
      <div id="search-description" className="sr-only">
        Search terminology. Use Escape to clear search or Ctrl+K to focus search field.
      </div>
    </div>
  )
}

/**
 * SearchBar Prop Types (for documentation)
 * 
 * @typedef {Object} SearchBarProps
 * @property {string} searchTerm - Current search term value
 * @property {Function} onSearchChange - Callback when search term changes
 * @property {string} [placeholder='Search terminology...'] - Input placeholder text
 * @property {number} [debounceMs=300] - Debounce delay for search
 * @property {boolean} [showClear=true] - Whether to show clear button
 * @property {boolean} [isLoading=false] - Loading state for search indicator
 * @property {string} [className] - Additional CSS classes for container
 */