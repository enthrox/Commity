"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github, ArrowRight, Shield, Zap, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const benefits = [
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "OAuth 2.0 with GitHub for maximum security",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Get started immediately after authentication",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Built by developers, for developers",
  },
]

export function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    // Simulate GitHub OAuth flow
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 animate-fade-in-up">
            Welcome to Commity
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Connect your GitHub account to start publishing blogs directly to your repositories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Login Card */}
          <Card className="animate-fade-in-up animation-delay-400">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Sign in with GitHub</CardTitle>
              <CardDescription>
                Authenticate securely using your GitHub account to access all Commity features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={() => signIn("github")}
                disabled={isLoading}
                className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white h-12 text-lg transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By signing in, you agree to our{" "}
                  <Link href="/contact" className="text-black dark:text-white hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/contact" className="text-black dark:text-white hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="space-y-6 animate-fade-in-up animation-delay-600">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Why choose GitHub authentication?</h3>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-1">{benefit.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            Don't have a GitHub account?{" "}
            <a
              href="https://github.com/join"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black dark:text-white hover:underline font-medium"
            >
              Create one for free
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
