import { cn } from "../lib/utils"
import { useEffect, useState, useRef } from "react"
import { ThemeToggle } from "./ThemeToggle"
import { Link, useLocation } from "react-router-dom"

// ===== NAVIGATION CONFIGURATION =====

/**
 * Main navigation items displayed in desktop navigation bar
 * @type {Array<{name: string, href: string}>}
 */
const MainNavItems = [
  { name: "Techniques", href: "/techniques" },
  { name: "Patterns", href: "/patterns" },
  { name: "History", href: "/history" }
]

/**
 * Additional navigation items hidden in dropdown menu
 * @type {Array<{name: string, href: string}>}
 */
const AdditionalNavItems = [
  { name: "Terminology", href: "/terminology" },
  { name: "Quiz", href: "/quiz" },
]

// ===== MAIN COMPONENT =====

/**
 * Navbar Component
 * 
 * Professional responsive navigation bar with dynamic styling,
 * dropdown menus, mobile optimization, and theme integration.
 * 
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Dynamic styling based on scroll position and route
 * - Dropdown navigation for additional pages
 * - Theme toggle integration
 * - Accessibility-compliant navigation patterns
 * - Smooth transitions and professional animations
 * 
 * @returns {JSX.Element} Navigation bar component
 * 
 * @example
 * <Navbar />
 */
export const Navbar = () => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[boolean, Function]} Scroll detection state */
  const [scrolled, setScrolled] = useState(false)
  
  /** @type {[boolean, Function]} Mobile menu open state */
  const [menuOpen, setMenuOpen] = useState(false)
  
  /** @type {[boolean, Function]} Dropdown menu open state */
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // ===== HOOKS & REFERENCES =====
  
  const location = useLocation()
  const dropdownRef = useRef(null)

  // ===== EFFECTS =====

  /**
   * Handles click outside dropdown to close it
   */
  useEffect(() => {
    /**
     * Closes dropdown when clicking outside
     * @param {MouseEvent} event - Mouse click event
     */
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /**
   * Handles scroll detection for dynamic styling
   */
  useEffect(() => {
    /**
     * Updates scroll state based on window position
     */
    const handleScroll = () => {
      const offset = window.scrollY
      setScrolled(offset > 50)
    }

    window.addEventListener("scroll", handleScroll)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // ===== EVENT HANDLERS =====

  /**
   * Toggles mobile menu open/close state
   */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  /**
   * Closes mobile menu when navigating
   */
  const handleMobileNavClick = () => {
    setMenuOpen(false)
  }

  /**
   * Toggles dropdown menu open/close state
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  /**
   * Closes dropdown when navigating
   */
  const handleDropdownNavClick = () => {
    setDropdownOpen(false)
  }

  // ===== COMPUTED VALUES =====

  /**
   * Determines if user is on hero section for special styling
   * @type {boolean}
   */
  const isOnHeroSection = location.pathname === "/" && !scrolled

  // ===== RENDER METHODS =====

  /**
   * Renders individual navigation link with dynamic styling
   * @param {Object} item - Navigation item object
   * @param {boolean} isMobile - Whether rendering for mobile
   * @returns {JSX.Element} Navigation link component
   */
  const renderNavLink = (item, isMobile = false) => (
    <Link 
      key={item.name}
      to={item.href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
        isOnHeroSection && !isMobile
          ? "text-white hover:text-primary hover:bg-white/10"
          : "text-foreground hover:text-primary hover:bg-primary/10",
        isMobile && "block text-base"
      )}
      onClick={isMobile ? handleMobileNavClick : undefined}
      aria-label={`Navigate to ${item.name} page`}
    >
      {item.name}
    </Link>
  )

  /**
   * Renders desktop navigation with dropdown
   * @returns {JSX.Element} Desktop navigation component
   */
  const renderDesktopNavigation = () => (
    <div className="hidden md:flex items-center space-x-4">
      <div className="flex items-baseline space-x-4">
        {/* Main Navigation Items */}
        {MainNavItems.map(item => renderNavLink(item))}
        
        {/* Dropdown Navigation */}
        {renderDropdownNavigation()}
      </div>
      <ThemeToggle />
    </div>
  )

  /**
   * Renders dropdown navigation for additional pages
   * @returns {JSX.Element} Dropdown navigation component
   */
  const renderDropdownNavigation = () => (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className={cn(
          "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200",
          isOnHeroSection
            ? "text-white hover:text-primary hover:bg-white/10"
            : "text-foreground hover:text-primary hover:bg-primary/10"
        )}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label="Additional navigation pages"
      >
        More
        <svg 
          className={cn(
            "ml-1 w-4 h-4 transition-transform duration-200",
            dropdownOpen ? "rotate-180" : "rotate-0"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border py-1 z-60"
          role="menu"
          aria-orientation="vertical"
        >
          {AdditionalNavItems.map((item) => (
            <Link 
              key={item.name}
              to={item.href}
              className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors duration-200"
              onClick={handleDropdownNavClick}
              role="menuitem"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  /**
   * Renders mobile menu button
   * @returns {JSX.Element} Mobile menu button component
   */
  const renderMobileMenuButton = () => (
    <div className="flex md:hidden items-center">
      <button
        onClick={toggleMenu}
        className={cn(
          "inline-flex items-center justify-center p-2 rounded-md transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          isOnHeroSection
            ? "text-white hover:text-primary hover:bg-white/10"
            : "text-foreground hover:text-primary hover:bg-primary/10"
        )}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
      >
        <span className="sr-only">Open main menu</span>
        {!menuOpen ? (
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
    </div>
  )

  /**
   * Renders mobile navigation menu
   * @returns {JSX.Element} Mobile navigation component
   */
  const renderMobileNavigation = () => (
    menuOpen && (
      <div 
        className="md:hidden mobile-menu z-50 bg-background/95 backdrop-blur-sm border-b border-border"
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* All Navigation Items */}
          {[...MainNavItems, ...AdditionalNavItems].map(item => 
            renderNavLink(item, true)
          )}
          
          {/* Theme Toggle Section */}
          <div className="px-3 py-4 border-t border-border mt-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    )
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <nav
      className={cn(
        "fixed w-full z-50 top-0 left-0 transition-all duration-300", 
        scrolled 
          ? "bg-background/95 backdrop-blur-sm shadow-lg border-b border-border" 
          : "bg-transparent",
        isOnHeroSection ? "text-white" : "text-foreground"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className={cn(
                "text-xl font-bold transition-colors duration-200",
                isOnHeroSection 
                  ? "text-white hover:text-primary"
                  : "text-foreground hover:text-primary"
              )}
              aria-label="ITF Taekwon-Do Guide - Home"
            >
              ITF Taekwon-Do Guide
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {renderDesktopNavigation()}
          
          {/* Mobile Menu Button */}
          {renderMobileMenuButton()}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {renderMobileNavigation()}
    </nav>
  )   
}