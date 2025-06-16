import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// Helper function to create HTML from post data
function createHtmlFromPostData(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3 { color: #333; }
        pre { background-color: #eee; padding: 10px; border-radius: 5px; overflow-x: auto; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div>
        ${content}
    </div>
</body>
</html>`;
}

// Helper function to ensure the /blogs/ folder exists
async function ensureBlogFolder(octokit: Octokit, owner: string, repo: string, branch: string): Promise<void> {
  const path = 'blogs';
  try {
    await octokit.repos.getContents({
      owner,
      repo,
      path,
      ref: branch,
    });
  } catch (error: any) {
    if (error.status === 404) {
      // Folder does not exist, create it
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `${path}/.gitkeep`, // Create a dummy file to ensure folder creation
        message: 'feat(blogs): create blogs folder',
        content: '',
        branch,
      });
    } else {
      throw error;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { repo: repoName, blogTitle, blogContent, accessToken, username } = await req.json();

    if (!repoName || !blogTitle || !blogContent || !accessToken || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const octokit = new Octokit({ auth: accessToken });

    // Ensure the blogs folder exists
    const defaultBranch = (await octokit.repos.get({ owner: username, repo: repoName })).data.default_branch;
    await ensureBlogFolder(octokit, username, repoName, defaultBranch);

    // Check for .config file (placeholder for actual config check)
    try {
      await octokit.repos.getContents({
        owner: username,
        repo: repoName,
        path: 'blogs/.config',
        ref: defaultBranch,
      });
    } catch (error: any) {
      if (error.status === 404) {
        return NextResponse.json({ error: 'Please configure Commity in this repo by creating a .config file in the /blogs folder.' }, { status: 400 });
      }
      throw error;
    }

    const fileName = `${blogTitle.toLowerCase().replace(/\s+/g, '-')}.html`;
    const filePath = `blogs/${fileName}`;
    const fileContent = createHtmlFromPostData(blogTitle, blogContent);
    const contentEncoded = Buffer.from(fileContent).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner: username,
      repo: repoName,
      path: filePath,
      message: `chore(blog): add ${blogTitle}`,
      content: contentEncoded,
      branch: defaultBranch,
    });

    const fileUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}/${filePath}`;
    return NextResponse.json({ message: 'Blog posted successfully!', fileUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Error posting blog:', error);
    return NextResponse.json({ error: error.message || 'Failed to post blog' }, { status: 500 });
  }
} 