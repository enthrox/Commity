import { Github, FileText, Eye, Upload, Settings, Zap, Users, Shield } from "lucide-react"

const detailedSteps = [
  {
    number: "01",
    icon: Github,
    title: "Connect Your GitHub Account",
    description: "Securely authenticate with GitHub using OAuth 2.0 and grant Commity access to your repositories.",
    details: [
      "Click 'Login with GitHub' to start the authentication process",
      "Authorize Commity to access your repositories",
      "Choose which repositories you want to use for blogging",
      "Set up permissions and access controls",
    ],
    tips: "Make sure you have admin access to the repositories you want to use for blogging.",
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure Your Repository",
    description: "Select your target repository and configure the blog structure and settings.",
    details: [
      "Choose from your available repositories",
      "Set up the blog folder structure (e.g., /blogs, /posts)",
      "Configure file naming conventions",
      "Set default commit message templates",
      "Choose your preferred file format (Markdown or HTML)",
    ],
    tips: "We recommend using a dedicated 'blogs' folder to keep your content organized.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Write Your Content",
    description: "Use our powerful editor to create engaging blog posts with markdown support and live preview.",
    details: [
      "Start with a compelling title and meta description",
      "Write your content using our markdown editor",
      "Add images, code blocks, and other rich media",
      "Use the live preview to see how your post will look",
      "Add tags and categories for better organization",
    ],
    tips: "Use the preview mode to ensure your content looks perfect before publishing.",
  },
  {
    number: "04",
    icon: Eye,
    title: "Preview and Review",
    description: "Review your content with our responsive preview feature and make final adjustments.",
    details: [
      "Check your content in desktop and mobile views",
      "Verify all links and images are working correctly",
      "Review SEO meta tags and social media previews",
      "Test code blocks and syntax highlighting",
      "Ensure proper formatting and readability",
    ],
    tips: "Always preview your content on different screen sizes before publishing.",
  },
  {
    number: "05",
    icon: Upload,
    title: "Publish to GitHub",
    description: "With one click, commit your blog post directly to your GitHub repository.",
    details: [
      "Click the 'Publish' button to commit your changes",
      "Add a custom commit message if desired",
      "Choose the target branch for your content",
      "Automatic file organization and naming",
      "Instant deployment to your website",
    ],
    tips: "Your blog post will be immediately available on your website if you have auto-deployment set up.",
  },
  {
    number: "06",
    icon: Zap,
    title: "Automatic Deployment",
    description: "Your content is automatically deployed to your website through your existing CI/CD pipeline.",
    details: [
      "GitHub Actions or other CI/CD tools pick up the changes",
      "Your static site generator rebuilds the site",
      "New content is deployed to your hosting platform",
      "SEO sitemaps and RSS feeds are updated automatically",
      "Social media previews are generated",
    ],
    tips: "Set up GitHub Actions for automatic deployment to platforms like Vercel, Netlify, or GitHub Pages.",
  },
]

const additionalFeatures = [
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work with your team using GitHub's collaboration features like pull requests and reviews.",
  },
  {
    icon: Shield,
    title: "Version Control",
    description: "Full version history and the ability to rollback changes using Git's powerful version control.",
  },
  {
    icon: Settings,
    title: "Customization",
    description: "Customize the workflow to match your team's processes and deployment requirements.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="pt-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 animate-fade-in-up">
            How Commity Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            A step-by-step guide to publishing blogs with GitHub integration
          </p>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-16">
          {detailedSteps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Step Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white dark:text-black" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Step {step.number}</span>
                    <h3 className="text-2xl font-bold text-black dark:text-white">{step.title}</h3>
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>

                <ul className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>💡 Pro Tip:</strong> {step.tips}
                  </p>
                </div>
              </div>

              {/* Step Illustration */}
              <div className="flex-1 max-w-md">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                    <step.icon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-12">Additional Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${(index + 6) * 100}ms` }}
              >
                <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white dark:text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 rounded-2xl p-12 text-white dark:text-black">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Blogging?</h2>
            <p className="text-xl mb-8 opacity-90">Get started with Commity in less than 5 minutes</p>
            <button className="bg-white dark:bg-black text-black dark:text-white px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
