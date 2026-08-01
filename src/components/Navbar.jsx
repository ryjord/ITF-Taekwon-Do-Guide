import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronDown, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "./ThemeToggle"

const MainNavItems = [
  { name: "Techniques", href: "/techniques" },
  { name: "Patterns", href: "/patterns" },
  { name: "History", href: "/history" },
]

const AdditionalNavItems = [
  { name: "Terminology", href: "/terminology" },
  { name: "Quiz", href: "/quiz" },
  { name: "Grading", href: "/grading" },
]

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isOnHeroSection = location.pathname === "/" && !scrolled
  const navButtonClass = cn(
    "hover:bg-primary/10 hover:text-primary",
    isOnHeroSection && "text-white hover:text-white"
  )

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/95 shadow-lg backdrop-blur-sm"
          : "bg-transparent",
        isOnHeroSection ? "text-white" : "text-foreground"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className={cn(
            "text-xl font-bold transition-colors hover:text-primary",
            isOnHeroSection && "text-white"
          )}
          aria-label="ITF Taekwon-Do Guide - Home"
        >
          ITF Taekwon-Do Guide
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {MainNavItems.map((item) => (
            <Button key={item.name} asChild variant="ghost" className={navButtonClass}>
              <Link to={item.href}>{item.name}</Link>
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={navButtonClass}
                aria-label="Additional navigation pages"
              >
                More
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {AdditionalNavItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link to={item.href}>{item.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>

        {/* Mobile navigation */}
        <div className="flex items-center md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={navButtonClass}
                aria-label="Toggle navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>ITF Taekwon-Do Guide</SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 px-4"
                aria-label="Mobile navigation"
              >
                {[...MainNavItems, ...AdditionalNavItems].map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link
                      to={item.href}
                      className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetFooter className="flex-row items-center justify-between border-t border-border">
                <span className="text-base font-medium text-foreground">Theme</span>
                <ThemeToggle />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
