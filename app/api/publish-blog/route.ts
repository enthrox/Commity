import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Using path alias

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { owner, repoName, branch, filePath, content, commitMessage } = await req.json();

    const octokit = new Octokit({ auth: session.accessToken });

    let sha: string | undefined;
    try {
      const fileResponse = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: filePath,
        ref: branch,
      });
      // @ts-ignore
      sha = fileResponse.data.sha;
    } catch (error: any) {
      if (error.status !== 404) {
        // Only re-throw if it's not a 404 (file not found)
        throw error;
      }
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: filePath,
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
      branch,
      sha,
    });

    return NextResponse.json({ message: 'Blog post published successfully!' });
  } catch (error: any) {
    console.error("Error publishing blog post:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 