import { cn } from '../../lib/utils'

/**
 * CategoryNavigation Component
 * 
 * Sticky navigation bar for browsing ITF Taekwon-Do technique categories.
 * Provides smooth category switching with visual feedback and accessibility
 * features for an optimal user experience.
 * 
 * Features:
 * - Sticky positioning with backdrop blur effect
 * - Smooth category transitions with visual indicators
 * - Horizontal scrolling for mobile devices
 * - Accessibility-compliant navigation patterns
 * - Responsive design with proper typography scaling
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.categories - Array of category objects with id, name, and icon
 * @param {string} props.currentCategory - Currently selected category ID
 * @param {Function} props.onCategoryChange - Callback function when category is changed
 * @returns {JSX.Element} Category navigation component
 */
export const CategoryNavigation = ({ categories, currentCategory, onCategoryChange }) => {
  // ===== EVENT HANDLERS =====

  /**
   * Handles category selection with proper event handling
   * @param {string} categoryId - The ID of the category to select
   */
  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId)
  }

  /**
   * Handles keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {string} categoryId - The category ID to select
   */
  const handleCategoryKeyDown = (event, categoryId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCategoryClick(categoryId)
    }
  }

  // ===== RENDER METHODS =====

  /**
   * Renders individual category navigation button
   * @param {Object} category - Category data object
   * @returns {JSX.Element} Category navigation button
   */
  const renderCategoryButton = (category) => {
    const isActive = currentCategory === category.id
    
    return (
      <button
        key={category.id}
        onClick={() => handleCategoryClick(category.id)}
        onKeyDown={(e) => handleCategoryKeyDown(e, category.id)}
        className={cn(
          // Base styles
          "flex items-center space-x-3 px-6 py-4 whitespace-nowrap transition-all duration-200 border-b-2 font-semibold text-sm md:text-base",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:z-10",
          
          // Active state
          isActive
            ? "text-primary border-primary bg-primary/5"
            : "text-foreground/70 border-transparent hover:text-primary hover:bg-primary/5 hover:border-primary/30",
        )}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`View ${category.name} techniques`}
        role="tab"
        tabIndex={0}
      >
        {/* Category Icon */}
        <span 
          className="text-lg flex-shrink-0"
          aria-hidden="true"
        >
          {category.icon}
        </span>
        
        {/* Category Name */}
        <span className="font-medium">
          {category.name}
        </span>
      </button>
    )
  }

  // ===== MAIN COMPONENT RENDER =====

  return (
    <nav 
      className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm supports-backdrop-blur:bg-background/60"
      role="navigation"
      aria-label="Technique categories"
    >
      <div className="max-w-7xl mx-auto">
        <div 
          className="flex overflow-x-auto scrollbar-hide"
          role="tablist"
          aria-label="Select technique category"
        >
          {categories.map(renderCategoryButton)}
        </div>
      </div>
    </nav>
  )
}