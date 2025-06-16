"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Github, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-black">Commity</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-black transition-all duration-300 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/documentation"
              className="text-gray-700 hover:text-black transition-all duration-300 relative group"
            >
              Documentation
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-700 hover:text-black transition-all duration-300 relative group"
            >
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black transition-all duration-300 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {!session ? (
              <Button
                variant="outline"
                asChild
                className="hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={() => signIn("github")}
              >
                <Link href="#" className="flex items-center space-x-2">
                  <Github className="w-4 h-4" />
                  <span>Login with GitHub</span>
                </Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || "User Avatar"}
                      />
                      <AvatarFallback>
                        {session.user?.name ? session.user.name.charAt(0) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({
                    callbackUrl: process.env.NEXTAUTH_URL
                  })}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Animated Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 p-0"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle mobile menu</span>
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white overflow-y-auto shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/documentation"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href="/how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
            <div className="px-3 py-2">
              {!session ? (
                <Button
                  variant="outline"
                  asChild
                  className="w-full"
                  onClick={() => signIn("github")}
                >
                  <Link href="#" className="flex items-center justify-center space-x-2">
                    <Github className="w-4 h-4" />
                    <span>Login with GitHub</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  asChild
                  className="w-full"
                  onClick={() => signOut({
                    callbackUrl: process.env.NEXTAUTH_URL
                  })}
                >
                  <Link href="#" className="flex items-center justify-center space-x-2">
                    <span>Logout</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
