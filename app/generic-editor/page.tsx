"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Octokit } from "@octokit/rest"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface FileDetails {
  owner: string;
  repoName: string;
  branch: string;
  path: string;
  sha: string;
}

export default function GenericEditorPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommiting, setIsCommiting] = useState(false);

  useEffect(() => {
    const owner = searchParams.get('owner');
    const repoName = searchParams.get('repoName');
    const branch = searchParams.get('branch') || 'main';
    const path = searchParams.get('path');
    const sha = searchParams.get('sha');

    if (owner && repoName && path && sha) {
      setFileDetails({ owner, repoName, branch, path, sha });
    } else {
      setError("Missing file parameters.");
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchFileContent() {
      if (!session?.accessToken || !fileDetails) {
        setLoading(false);
        return;
      }

      const octokit = new Octokit({ auth: session.accessToken });
      try {
        const response = await octokit.repos.getContent({
          owner: fileDetails.owner,
          repo: fileDetails.repoName,
          path: fileDetails.path,
          ref: fileDetails.branch,
        });

        // @ts-ignore
        const content = Buffer.from(response.data.content, 'base64').toString('utf8');
        setFileContent(content);
      } catch (err: any) {
        console.error("Error fetching file content:", err);
        setError(err.message || "Failed to fetch file content.");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated" && fileDetails) {
      fetchFileContent();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status, fileDetails]);

  const handleCommit = async () => {
    if (!fileDetails || !commitMessage || !fileContent || !session?.accessToken) return;
    setIsCommiting(true);
    setError(null);
    const octokit = new Octokit({ auth: session.accessToken });

    try {
      await octokit.repos.createOrUpdateFileContents({
        owner: fileDetails.owner,
        repo: fileDetails.repoName,
        path: fileDetails.path,
        message: commitMessage,
        content: Buffer.from(fileContent).toString('base64'),
        branch: fileDetails.branch,
        sha: fileDetails.sha,
      });
      setCommitMessage('');
      alert("File updated and committed successfully!");
      // Optionally, refresh content or redirect
      router.back(); // Go back to the previous page (e.g., blog list)
    } catch (err: any) {
      console.error("Error committing changes:", err);
      setError(err.message || "Failed to commit changes.");
    } finally {
      setIsCommiting(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading file...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg p-4 text-center">
        <p className="mb-4">You need to be logged in to edit files.</p>
        <Button onClick={() => router.push('/api/auth/signin')}>
          Login with GitHub
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!fileDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-500">
        Error: No file selected for editing.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-3xl font-bold mb-6">Editing: {fileDetails.path.split('/').pop()}</h1>

      <Textarea
        className="w-full h-96 mb-4 font-mono text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3"
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
        placeholder="Edit file content here..."
      />
      <Input
        type="text"
        className="w-full mb-4"
        placeholder="Commit message (e.g., 'docs: update README')"
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
      />
      <Button
        onClick={handleCommit}
        disabled={isCommiting || !commitMessage}
        className="bg-black hover:bg-gray-800 text-white"
      >
        {isCommiting ? "Commiting..." : "Commit Changes"}
      </Button>
    </div>
  );
}
