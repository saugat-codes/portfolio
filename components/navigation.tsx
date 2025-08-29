"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const navigationItems = [
  { name: "Home", href: "#home", route: "/" },
  { name: "About", href: "#about", route: "/#about" },
  { name: "Projects", href: "#projects", route: "/projects" },
  { name: "Blog", href: "#blog", route: "/blog" },
  { name: "Contact", href: "#contact", route: "/#contact" },
]

interface NavigationProps {
  currentPage?: 'home' | 'projects' | 'blog'
}

export default function Navigation({ 
  currentPage = 'home'
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Handle scroll to update active section (only for home page)
  useEffect(() => {
    if (currentPage !== 'home') return

    const handleScroll = () => {
      const sections = navigationItems.map(item => item.href.substring(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [currentPage])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('nav')) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const getHref = (item: typeof navigationItems[0]) => {
    if (currentPage === 'home') {
      return item.href
    }
    return item.route
  }

  const isActive = (item: typeof navigationItems[0]) => {
    if (currentPage === 'home') {
      return activeSection === item.href.substring(1)
    }
    return (currentPage === 'projects' && item.name === 'Projects') || 
           (currentPage === 'blog' && item.name === 'Blog')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-xl font-bold font-[family-name:var(--font-orbitron)] text-accent"
              onClick={handleLinkClick}
            >
              Saugat
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={getHref(item)}
                  className={`text-foreground hover:text-accent transition-colors duration-300 relative group ${
                    isActive(item) ? 'text-accent' : ''
                  }`}
                >
                  {item.name}
                  <span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive(item) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-accent hover:bg-accent/10 focus:ring-2 focus:ring-accent/20 transition-all duration-200"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-6 w-6 transition-transform duration-200" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
          role="menu"
          aria-hidden={!isOpen}
        >
          <div className="px-2 pt-2 pb-6 space-y-1 bg-background/95 backdrop-blur-md border-t border-border/50">
            {navigationItems.map((item, index) => (
              <Link
                key={item.name}
                href={getHref(item)}
                onClick={handleLinkClick}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                className={`block px-3 py-3 text-base font-medium transition-all duration-300 rounded-md ${
                  isActive(item)
                    ? 'text-accent bg-accent/10 border-l-4 border-accent'
                    : 'text-foreground hover:text-accent hover:bg-accent/5'
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  )
}
