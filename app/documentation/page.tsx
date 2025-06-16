import { Edit3, Github, Eye, Upload, Zap, Code } from "lucide-react"

const documentationSections = [
  {
    icon: Edit3,
    title: "Getting Started with Commity",
    description: "Learn how to set up your first blog with Commity and connect to your GitHub repository.",
  },
  {
    icon: Github,
    title: "GitHub Integration Guide",
    description: "Detailed steps on seamlessly connecting Commity to your GitHub repository and managing commits.",
  },
  {
    icon: Eye,
    title: "Live Preview and Publishing",
    description: "Understand how to use the live preview feature and publish your blogs with a single click.",
  },
  {
    icon: Zap,
    title: "Asset Management",
    description: "A guide to uploading and managing images and other assets directly within your repository.",
  },
  {
    icon: Upload,
    title: "Supported Technologies",
    description: "Information on current compatibility (HTML only) and future plans for framework support.",
  },
  {
    icon: Code,
    title: "Troubleshooting & FAQs",
    description: "Find answers to common questions and solutions for potential issues.",
  },
]

export default function DocumentationPage() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 animate-fade-in-up">Commity Documentation</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Comprehensive guides and resources to help you get started and make the most of Commity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documentationSections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4 group-hover:text-gray-800 transition-colors duration-300">
                {section.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 