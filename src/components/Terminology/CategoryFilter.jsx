import { cn } from '../../lib/utils'

/**
 * CategoryFilter Component
 * 
 * Professional filter component for categorizing and filtering content
 * with smooth animations, accessibility features, and responsive design.
 * 
 * Features:
 * - Dynamic category filtering with visual feedback
 * - Smooth transitions and hover effects
 * - Accessibility-compliant keyboard navigation
 * - Responsive design with flexible layout
 * - Professional styling with consistent design language
 * 
 * @param {Object} props - Component properties
 * @param {Array<string>} props.categories - Array of category names to display
 * @param {string} props.selectedCategory - Currently selected category filter
 * @param {Function} props.onCategoryChange - Callback when category selection changes
 * @param {string} [props.allLabel='All Terms'] - Label for the "all categories" option
 * @param {string} [props.className] - Additional CSS classes for container customization
 * 
 * @returns {JSX.Element} Category filter component
 * 
 * @example
 * <CategoryFilter 
 *   categories={['Stances', 'Kicks', 'Blocks']}
 *   selectedCategory={selectedCategory}
 *   onCategoryChange={setSelectedCategory}
 *   allLabel="All Techniques"
 * />
 */
export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  allLabel = 'All Terms',
  className 
}) => {
  // ===== EVENT HANDLERS =====

  /**
   * Handles category selection with proper event handling
   * @param {string} category - Selected category value
   */
  const handleCategorySelect = (category) => {
    onCategoryChange(category)
  }

  /**
   * Handles keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {string} category - Category to select
   */
  const handleCategoryKeyDown = (event, category) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCategorySelect(category)
    }
  }

  // ===== RENDER METHODS =====

  /**
   * Renders individual category filter button
   * @param {Object} params - Button parameters
   * @param {string} params.label - Display label for the button
   * @param {string} params.value - Category value for filtering
   * @param {boolean} params.isSelected - Whether the category is currently selected
   * @param {number} params.index - Array index for animation delay
   * @returns {JSX.Element} Category filter button
   */
  const renderCategoryButton = ({ label, value, isSelected, index = 0 }) => (
    <button
      key={value}
      onClick={() => handleCategorySelect(value)}
      onKeyDown={(event) => handleCategoryKeyDown(event, value)}
      className={cn(
        // Base styles
        "px-4 py-2 rounded-full border transition-all duration-300",
        "font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary",
        "focus:ring-offset-2 focus:ring-offset-background focus:z-10",
        "transform hover:scale-105 active:scale-95",
        
        // Selected state
        isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
          : "bg-background text-foreground/70 border-border hover:bg-primary/10 hover:text-foreground hover:border-primary/30",
          
        // Reduced motion support
        "motion-reduce:transform-none motion-reduce:transition-none"
      )}
      aria-pressed={isSelected}
      aria-label={`Filter by ${label} category`}
      style={{
        animationDelay: `${index * 50}ms`
      }}
    >
      {label}
    </button>
  )

  /**
   * Renders the "All Categories" filter button
   * @returns {JSX.Element} All categories button
   */
  const renderAllCategoriesButton = () =>
    renderCategoryButton({
      label: allLabel,
      value: '',
      isSelected: selectedCategory === '',
      index: 0
    })

  /**
   * Renders category-specific filter buttons
   * @returns {Array<JSX.Element>} Array of category buttons
   */
  const renderCategoryButtons = () =>
    categories.map((category, index) =>
      renderCategoryButton({
        label: category,
        value: category,
        isSelected: selectedCategory === category,
        index: index + 1 // Start from 1 to account for "All" button
      })
    )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div 
      className={cn(
        "flex flex-wrap gap-3 justify-center",
        "p-1 bg-muted/30 rounded-2xl border border-border/50",
        className
      )}
      role="toolbar"
      aria-label="Category filter options"
    >
      {renderAllCategoriesButton()}
      {renderCategoryButtons()}
    </div>
  )
}

/**
 * CategoryFilter Prop Types (for documentation)
 * 
 * @typedef {Object} CategoryFilterProps
 * @property {Array<string>} categories - Array of category names to display
 * @property {string} selectedCategory - Currently selected category filter
 * @property {Function} onCategoryChange - Callback when category selection changes
 * @property {string} [allLabel='All Terms'] - Label for the "all categories" option
 * @property {string} [className] - Additional CSS classes for container customization
 */