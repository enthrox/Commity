"use client"

import { useSession, signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Octokit } from "@octokit/rest"
import { useRouter } from 'next/navigation'

interface Repository {
  id: number
  name: string
  html_url: string
  description: string | null
  owner: { login: string }
  framework?: string
}

interface ProcessingState {
  repoId: number | null
  message: string | null
  isCreatingFolder: boolean
  framework: string | null
  error: string | null
}

async function analyzeFramework(octokit: Octokit, owner: string, repoName: string, branch: string): Promise<string> {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo: repoName,
      path: 'package.json',
      ref: branch,
    })
    // @ts-ignore
    const content = Buffer.from(response.data.content, 'base64').toString('utf8')
    const packageJson = JSON.parse(content)

    if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
      return "Next.js"
    } else if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
      return "React"
    } else if (packageJson.dependencies?.vue || packageJson.devDependencies?.vue) {
      return "Vue.js"
    } else if (packageJson.dependencies?.angular || packageJson.devDependencies?.angular) {
      return "Angular"
    } else if (packageJson.dependencies?.gatsby || packageJson.devDependencies?.gatsby) {
      return "Gatsby"
    } else {
      const hasSvelteKitDep = packageJson.dependencies && packageJson.dependencies["@sveltejs/kit"];
      const hasSvelteKitDevDep = packageJson.devDependencies && packageJson.devDependencies["@sveltejs/kit"];
      if (hasSvelteKitDep || hasSvelteKitDevDep) {
        return "SvelteKit";
      }
      return "Unknown / Static HTML"
    }
  } catch (error: any) {
    if (error.status === 404) {
      return "Static HTML"
    }
    // Only log other types of errors, not 404 for package.json
    console.error("Error analyzing framework (non-404):", error)
    return "Unknown"
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [processingState, setProcessingState] = useState<ProcessingState>({
    repoId: null,
    message: null,
    isCreatingFolder: false,
    framework: null,
    error: null,
  })
  const router = useRouter()

  useEffect(() => {
    async function fetchRepositories() {
      if (!session?.accessToken) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `token ${session.accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.statusText}`)
        }

        const fetchedRepos: Repository[] = await response.json()
        const reposWithFrameworks = await Promise.all(
          fetchedRepos.map(async (repo) => {
            const octokit = new Octokit({ auth: session.accessToken });
            const repoDetails = (await octokit.repos.get({ owner: repo.owner.login, repo: repo.name })).data;
            const defaultBranch = repoDetails.default_branch;
            const framework = await analyzeFramework(octokit, repo.owner.login, repo.name, defaultBranch);
            return { ...repo, framework };
          })
        );
        setRepositories(reposWithFrameworks)
      } catch (err: any) {
        setProcessingState(prev => ({ ...prev, error: err.message }))
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchRepositories()
    }
  }, [session, status])

  const handlePostBlogClick = async (repo: Repository) => {
    setProcessingState({
      repoId: repo.id,
      message: "Starting analysis...",
      isCreatingFolder: false,
      framework: repo.framework || null,
      error: null,
    })

    if (!session?.accessToken || !session.user?.name) {
      setProcessingState(prev => ({ ...prev, error: "User not authenticated or username not available." }))
      return
    }

    const octokit = new Octokit({ auth: session.accessToken })
    let defaultBranch = 'main';

    try {
      const repoDetails = (await octokit.repos.get({ owner: repo.owner.login, repo: repo.name })).data;
      defaultBranch = repoDetails.default_branch;
      
      setProcessingState((prev) => ({ ...prev, message: `Detected framework: ${repo.framework || 'Unknown'}.` }));

      setProcessingState((prev) => ({ ...prev, message: "Checking for /blogs folder..." }))
      try {
        await octokit.repos.getContent({
          owner: repo.owner.login,
          repo: repo.name,
          path: 'blogs',
          ref: defaultBranch,
        })
        setProcessingState((prev) => ({ ...prev, message: "/blogs folder found." }))
      } catch (err: any) {
        if (err.status === 404) {
          setProcessingState((prev) => ({ ...prev, message: "/blogs folder not found. Prompting to create...", isCreatingFolder: true }))
          return
        } else {
          throw err
        }
      }

      await checkAndCreateBlogFolder(octokit, repo.owner.login, repo.name, defaultBranch);

      setProcessingState(prev => ({ ...prev, message: "Setup complete! Redirecting to blog editor..." }));
      router.push(`/editor?owner=${repo.owner.login}&repoName=${repo.name}&branch=${defaultBranch}`); // Redirect to the main editor page

    } catch (err: any) {
      setProcessingState(prev => ({ ...prev, error: err.message || "An unexpected error occurred." }));
    }
  };

  const checkAndCreateBlogFolder = async (octokit: Octokit, owner: string, repo: string, branch: string) => {
    setProcessingState(prev => ({ ...prev, isCreatingFolder: false })); // Hide prompt if it was shown
    setProcessingState(prev => ({ ...prev, message: "Creating /blogs folder..." }));

    const path = 'blogs';
    const readmePath = `${path}/README.md`;
    let existingSha: string | undefined;

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: readmePath,
        ref: branch,
      });
      // @ts-ignore
      existingSha = response.data.sha;
      console.log('Existing README.md SHA retrieved:', existingSha); // Debugging log
      setProcessingState(prev => ({ ...prev, message: "Updating /blogs/README.md..." }));
    } catch (error: any) {
      if (error.status === 404) {
        // File doesn't exist, proceed to create it
        console.log('README.md not found (404), proceeding to create.'); // Debugging log
        setProcessingState(prev => ({ ...prev, message: "/blogs/README.md not found, creating..." }));
      } else {
        console.error('Error fetching existing README.md:', error); // Debugging log for other errors
        throw error; // Re-throw other errors
      }
    }

    try {
      console.log('Attempting createOrUpdateFileContents with SHA:', existingSha); // Debugging log
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: readmePath,
        message: existingSha ? 'docs(blogs): update blogs README' : 'feat(blogs): create blogs folder and initial README',
        content: Buffer.from("# Blogs Folder\n\nThis folder is managed by Commity.\n\nFeel free to add your blog posts here in Markdown format.\n").toString('base64'),
        branch,
        sha: existingSha, // Supply sha if updating
      });
      setProcessingState(prev => ({ ...prev, message: "/blogs folder created/updated successfully!" }));
    } catch (err: any) {
      setProcessingState(prev => ({ ...prev, error: err.message || "Failed to create/update /blogs folder." }));
      throw err; // Re-throw to be caught by the main handlePostBlogClick error handler
    }
  };

  const handleCreateBlogFolderConfirmation = async () => {
    if (!processingState.repoId || !session?.accessToken) {
      setProcessingState(prev => ({ ...prev, error: "Missing repo or access token for folder creation confirmation." }))
      return
    }

    const octokit = new Octokit({ auth: session.accessToken })
    const selectedRepo = repositories.find(r => r.id === processingState.repoId);

    if (!selectedRepo) {
      setProcessingState(prev => ({ ...prev, error: "Selected repository not found for folder creation." }))
      return;
    }

    let defaultBranch = 'main';
    try {
      const repoDetails = (await octokit.repos.get({ owner: selectedRepo.owner.login, repo: selectedRepo.name })).data;
      defaultBranch = repoDetails.default_branch;
      await checkAndCreateBlogFolder(octokit, selectedRepo.owner.login, selectedRepo.name, defaultBranch);
      // After creating folder, continue the setup process
      await handlePostBlogClick(selectedRepo); // Re-run the main flow to continue to navbar check
    } catch (err: any) {
      setProcessingState(prev => ({ ...prev, error: err.message || "Failed to confirm and create /blogs folder." }))
    }
  };

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading dashboard...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg p-4 text-center">
        <p className="mb-4">You need to be logged in to view the dashboard.</p>
        <Button onClick={() => signIn("github")}>
          Login with GitHub
        </Button>
      </div>
    )
  }

  if (processingState.error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-500">
        Error: {processingState.error}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-3xl font-bold mb-6">Your GitHub Repositories</h1>
      {repositories.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <div key={repo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400"><Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{repo.name}</Link></h2>
              <p className="text-gray-700 dark:text-gray-300 flex-grow">{repo.description || "No description provided."}</p>
              {repo.framework && (
                <p className="text-sm text-gray-500 mt-2">Framework: {repo.framework}</p>
              )}
              <div className="mt-4 flex space-x-2">
                <Button asChild variant="outline" className="flex-grow">
                  <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </Link>
                </Button>
                <Button
                  onClick={() => handlePostBlogClick(repo)}
                  disabled={processingState.repoId === repo.id && processingState.message !== null}
                  className="bg-black hover:bg-gray-800 text-white flex-grow"
                >
                  {processingState.repoId === repo.id && processingState.message
                    ? processingState.message
                    : "Post Blog"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {processingState.isCreatingFolder && processingState.repoId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4">Create /blogs folder?</h2>
            <p className="mb-6">The \`/blogs/\` folder does not exist in \"{repositories.find(r => r.id === processingState.repoId)?.name}\". Do you want to create it?</p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setProcessingState({ repoId: null, message: null, isCreatingFolder: false, framework: null, error: null })
                }}
                disabled={processingState.message?.includes("Creating...")}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBlogFolderConfirmation}
                disabled={processingState.message?.includes("Creating...")}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {processingState.message?.includes("Creating...") ? "Creating..." : "Proceed"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
