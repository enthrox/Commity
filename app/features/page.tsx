import {
  Edit3,
  Github,
  Eye,
  Upload,
  Zap,
  Code,
  FileText,
  Settings,
  Shield,
  Layers,
  GitBranch,
  Smartphone,
} from "lucide-react"

const detailedFeatures = [
  {
    icon: Edit3,
    title: "Advanced Markdown Editor",
    description:
      "Write with our powerful markdown editor featuring syntax highlighting, auto-completion, and live preview.",
    details: [
      "Syntax highlighting for code blocks",
      "Auto-completion for markdown syntax",
      "Real-time preview with custom styling",
      "Drag and drop image uploads",
      "Table editing support",
      "Math equation rendering with LaTeX",
    ],
  },
  {
    icon: Github,
    title: "Deep GitHub Integration",
    description: "Seamlessly connect to your GitHub repositories with full commit history and branch management.",
    details: [
      "OAuth 2.0 secure authentication",
      "Multi-repository support",
      "Custom commit messages",
      "Branch selection for publishing",
      "Automatic file organization",
      "Commit history tracking",
    ],
  },
  {
    icon: Eye,
    title: "Live Preview & Themes",
    description: "See exactly how your blog will look with customizable themes and responsive preview.",
    details: [
      "Real-time preview updates",
      "Multiple theme options",
      "Responsive design preview",
      "Custom CSS injection",
      "Mobile and desktop views",
      "Print-friendly layouts",
    ],
  },
  {
    icon: Zap,
    title: "One-Click Publishing",
    description: "Publish your blogs instantly with automated deployment and SEO optimization.",
    details: [
      "Instant GitHub commits",
      "Automatic SEO meta tags",
      "Social media previews",
      "Sitemap generation",
      "RSS feed creation",
      "Performance optimization",
    ],
  },
  {
    icon: Upload,
    title: "Asset Management",
    description: "Upload and manage images, videos, and other assets directly in your repository.",
    details: [
      "Drag and drop file uploads",
      "Image compression and optimization",
      "CDN-ready asset organization",
      "Multiple file format support",
      "Bulk upload capabilities",
      "Asset versioning and backup",
    ],
  },
  {
    icon: Code,
    title: "Framework Agnostic",
    description: "Works with any static site generator or framework - Next.js, Gatsby, Hugo, Jekyll, and more.",
    details: [
      "Next.js integration",
      "Gatsby plugin support",
      "Jekyll compatibility",
      "Hugo theme support",
      "Custom framework adapters",
      "API-first architecture",
    ],
  },
  {
    icon: FileText,
    title: "Content Management",
    description: "Organize and manage your blog posts with categories, tags, and advanced search.",
    details: [
      "Category and tag management",
      "Advanced search and filtering",
      "Draft and published states",
      "Content scheduling",
      "Bulk operations",
      "Content analytics",
    ],
  },
  {
    icon: Settings,
    title: "Customization Options",
    description: "Customize your blogging experience with themes, plugins, and advanced settings.",
    details: [
      "Custom theme development",
      "Plugin ecosystem",
      "Advanced configuration",
      "Webhook integrations",
      "Custom domains",
      "Analytics integration",
    ],
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description: "Your content stays secure with GitHub's enterprise-grade security and privacy controls.",
    details: [
      "GitHub's security infrastructure",
      "Private repository support",
      "Access control management",
      "Audit logs and monitoring",
      "GDPR compliance",
      "Data encryption",
    ],
  },
  {
    icon: Layers,
    title: "Multi-Site Management",
    description: "Manage multiple blogs and websites from a single dashboard with team collaboration.",
    details: [
      "Multiple site management",
      "Team collaboration tools",
      "Role-based permissions",
      "Shared asset libraries",
      "Cross-site content sync",
      "Centralized analytics",
    ],
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Full version control for your content with Git's powerful branching and merging capabilities.",
    details: [
      "Content version history",
      "Branch-based workflows",
      "Merge conflict resolution",
      "Rollback capabilities",
      "Change tracking",
      "Collaborative editing",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Write and publish on the go with our fully responsive mobile interface.",
    details: [
      "Mobile-first design",
      "Touch-optimized editor",
      "Offline editing support",
      "Mobile preview modes",
      "Progressive web app",
      "Cross-device sync",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="pt-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 animate-fade-in-up">
            Powerful Features for Modern Blogging
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Everything you need to create, manage, and publish beautiful blogs with the power of GitHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {detailedFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-white dark:text-black" />
              </div>

              <h3 className="text-xl font-semibold text-black dark:text-white mb-4 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{feature.description}</p>

              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-black dark:bg-white rounded-2xl p-12 text-white dark:text-black">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of developers already using Commity</p>
            <button className="bg-white dark:bg-black text-black dark:text-white px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
