"use client"

import { useState } from "react"
import { Github, Plus, BookOpen, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const mockRepos = [
  {
    id: 1,
    name: "my-portfolio",
    description: "Personal portfolio website built with Next.js",
    url: "https://github.com/user/my-portfolio",
    hasBlogs: true,
    language: "TypeScript",
    stars: 24,
  },
  {
    id: 2,
    name: "company-website",
    description: "Company landing page with blog section",
    url: "https://github.com/user/company-website",
    hasBlogs: false,
    language: "JavaScript",
    stars: 12,
  },
  {
    id: 3,
    name: "docs-site",
    description: "Documentation site with markdown support",
    url: "https://github.com/user/docs-site",
    hasBlogs: true,
    language: "HTML",
    stars: 8,
  },
]

export function Dashboard() {
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center animate-pulse">
              <Github className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-black">Welcome back!</h1>
              <p className="text-gray-600 text-sm md:text-base">Ready to publish your next blog post?</p>
            </div>
          </div>
        </div>

        {/* Repository Selection */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-black mb-4 md:mb-6">Select Repository</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {mockRepos.map((repo) => (
              <Card
                key={repo.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  selectedRepo === repo.id ? "ring-2 ring-black shadow-lg" : ""
                }`}
                onClick={() => setSelectedRepo(repo.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base md:text-lg truncate">{repo.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{repo.language}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">⭐ {repo.stars}</span>
                      </div>
                    </div>
                    {repo.hasBlogs && (
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Has blogs folder" />
                    )}
                  </div>
                  <CardDescription className="text-sm line-clamp-2">{repo.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs md:text-sm text-gray-500 hover:text-black transition-colors truncate flex-1 mr-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on GitHub
                    </a>
                    <Button
                      size="sm"
                      variant={selectedRepo === repo.id ? "default" : "outline"}
                      className={`flex-shrink-0 ${selectedRepo === repo.id ? "bg-black hover:bg-gray-800" : ""}`}
                    >
                      {selectedRepo === repo.id ? "Selected" : "Choose"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        {selectedRepo && (
          <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm animate-fade-in-up">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4 md:mb-6">What would you like to do?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild className="bg-black hover:bg-gray-800 text-white h-auto p-4 md:p-6 group">
                <Link href="/editor" className="flex flex-col items-center space-y-2 w-full">
                  <Plus className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm md:text-base">Write New Blog</span>
                </Link>
              </Button>

              <Button variant="outline" className="h-auto p-4 md:p-6 group hover:bg-gray-50">
                <div className="flex flex-col items-center space-y-2">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm md:text-base">View Existing Blogs</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 md:p-6 group hover:bg-gray-50 sm:col-span-2 lg:col-span-1"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Settings className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm md:text-base">Repository Settings</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
