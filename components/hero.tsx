"use client"

import Link from "next/link"
import { Github, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signIn } from "next-auth/react"

export function Hero() {
  const { data: session } = useSession()

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-gray-150 to-gray-250 dark:from-gray-650 dark:to-gray-550 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Code-like decorative elements */}
        <div className="absolute top-32 right-1/4 opacity-10 dark:opacity-5">
          <div className="text-6xl font-mono text-gray-400 dark:text-gray-600 transform rotate-12">{"{ }"}</div>
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-10 dark:opacity-5">
          <div className="text-4xl font-mono text-gray-400 dark:text-gray-600 transform -rotate-12">{"</>"}</div>
        </div>
        <div className="absolute top-1/2 right-12 opacity-10 dark:opacity-5">
          <div className="text-5xl font-mono text-gray-400 dark:text-gray-600">{"#"}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Introducing Commity v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight animate-fade-in-up animation-delay-200">
            Publish Blogs to Your
            <br />
            <span className="text-gray-600 relative">
              Website in Seconds
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-black to-gray-400 transform scale-x-0 animate-scale-x animation-delay-1000"></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            Commity lets you write and publish rich blogs directly into your GitHub-hosted website.
            <br />
            No build setup. No CMS bloat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-600">
            {!session ? (
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                onClick={() => signIn("github")}
              >
                <Github className="w-5 h-5" />
                <span>Login with GitHub</span>
              </Button>
            ) : (
              <Button
                size="lg"
                asChild
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <Github className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </Link>
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              asChild
              className="px-8 py-4 text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/how-it-works" className="flex items-center space-x-2">
                <span>See How It Works</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Enhanced Hero Illustration */}
          <div className="relative max-w-4xl mx-auto animate-fade-in-up animation-delay-800">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="space-y-4 transform hover:scale-105 transition-all duration-300">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse animation-delay-200"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2 animate-pulse animation-delay-100"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6 animate-pulse animation-delay-200"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Write your blog</p>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-gray-400 animate-bounce-x" />
                </div>

                <div className="space-y-4 transform hover:scale-105 transition-all duration-300">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-2 mb-3">
                      <Github className="w-4 h-4 animate-pulse" />
                      <span className="text-sm font-medium">your-repo/blogs/</span>
                    </div>
                    <div className="text-xs text-gray-500">Auto-committed to GitHub</div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Published instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
