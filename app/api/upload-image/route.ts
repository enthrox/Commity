import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as uuid from 'uuid';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { owner, repoName, branch, imageData, fileName } = await req.json();

    if (!owner || !repoName || !imageData || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const octokit = new Octokit({ auth: session.accessToken });

    // Ensure the blogs/assets folder exists
    try {
      await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: 'blogs/assets',
        ref: branch,
      });
    } catch (error: any) {
      if (error.status === 404) {
        // Create the assets folder
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo: repoName,
          path: 'blogs/assets/.gitkeep',
          message: 'feat(blogs): create assets folder',
          content: '',
          branch,
        });
      } else {
        throw error;
      }
    }

    // Generate a unique filename
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuid.v4()}.${fileExtension}`;
    const filePath = `blogs/assets/${uniqueFileName}`;

    // Upload the image
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: filePath,
      message: `feat(assets): add ${fileName}`,
      content: imageData,
      branch,
    });

    // Return the URL for the uploaded image
    const imageUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${filePath}`;
    return NextResponse.json({ 
      message: 'Image uploaded successfully!',
      imageUrl,
      markdown: `![${fileName}](/blogs/assets/${uniqueFileName})`
    });

  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 