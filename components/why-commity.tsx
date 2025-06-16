import { Shield, Database, Code2, Users } from "lucide-react"

const benefits = [
  {
    icon: Code2,
    title: "Open Source",
    description: "Fully open source and transparent. Contribute to the project on GitHub.",
  },
  {
    icon: Database,
    title: "No Storage on Our Side",
    description: "Your content stays in your GitHub repository. We never store your data.",
  },
  {
    icon: Shield,
    title: "Works with Your Codebase",
    description: "Integrates seamlessly with your existing website and workflow.",
  },
  {
    icon: Users,
    title: "Developer-First Workflow",
    description: "Built by developers, for developers. Git-based workflow you already know.",
  },
]

export function WhyCommity() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Commity?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built with developers in mind, respecting your workflow and data ownership
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-8 h-8 text-black" />
              </div>

              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
