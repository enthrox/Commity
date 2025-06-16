import { Github, FileText, Eye, Upload } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Github,
    title: "Connect GitHub",
    description: "Authenticate with your GitHub account and select your website repository",
  },
  {
    number: "02",
    icon: FileText,
    title: "Select Your Repo",
    description: "Choose the repository where you want to publish your blogs",
  },
  {
    number: "03",
    icon: Eye,
    title: "Write Your Blog",
    description: "Use our editor to write your blog with live preview",
  },
  {
    number: "04",
    icon: Upload,
    title: "Post → Auto-Commit",
    description: "One click publishes your blog as .html or .md to /blogs folder",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get started with Commity in just four simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">{step.number}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-black mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
