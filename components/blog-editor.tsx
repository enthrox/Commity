"use client"

import { useState, useRef, useCallback } from "react"
import { 
  ArrowLeft, 
  Eye, 
  Upload, 
  Send, 
  Menu, 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Strikethrough as StrikethroughIcon, 
  Code as CodeIcon, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Code2, 
  Undo2, 
  Redo2, 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ResizableImage } from "@/components/editor/extensions/ResizableImage"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"

// Function to generate HTML content with proper structure
const generateHtmlContent = (title: string, content: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        pre {
            background-color: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            font-family: 'Courier New', Courier, monospace;
        }
        blockquote {
            border-left: 4px solid #ddd;
            margin: 0;
            padding-left: 1rem;
            color: #666;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
};

export function BlogEditor() {
  const searchParams = useSearchParams();
  const owner = searchParams?.get('owner') || '';
  const repoName = searchParams?.get('repoName') || '';
  const branch = searchParams?.get('branch') || 'main';
  
  const [title, setTitle] = useState("")
  const [content, setContent] = useState(
    '<h1>Your Blog Title</h1><p>Start writing your blog content here...</p>'
  );
  const [isPreview, setIsPreview] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [showPublishSuccessAnimation, setShowPublishSuccessAnimation] = useState(false);
  const [showFullPageSuccessAnimation, setShowFullPageSuccessAnimation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // History is enabled by default in StarterKit
      }), 
      // Image,
      // ImageResize,
      ResizableImage,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // Update content state with HTML from the editor
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Added list-disc and list-decimal to ensure visibility
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] md:min-h-[500px] p-4 marker:text-gray-900',
      },
    },
  });

  const handlePublish = async () => {
    if (!owner || !repoName || !title || !editor) {
      setPublishMessage("Error: Missing repository information, title, or editor content.");
      return;
    }

    setIsPublishing(true);
    setPublishMessage("Publishing...");

    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const fileName = `${slug}.html`;
      const filePath = `blogs/${fileName}`;
      const commitMessage = `feat(blog): add ${title}`;

      // Generate HTML content with proper structure
      const htmlContent = generateHtmlContent(title, editor.getHTML());

      const response = await fetch('/api/publish-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repoName,
          branch,
          filePath,
          content: htmlContent,
          commitMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish blog.');
      }

      setPublishMessage("Blog published successfully!");
      setShowPublishSuccessAnimation(true);
      setShowFullPageSuccessAnimation(true);
      console.log("showFullPageSuccessAnimation set to true");
      setTimeout(() => {
        setShowFullPageSuccessAnimation(false);
        setShowPublishSuccessAnimation(false);
        setPublishMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error publishing blog:", error);
      setPublishMessage(`Error publishing blog: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !owner || !repoName || !editor) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const imageData = base64Data.split(',')[1];

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            owner,
            repoName,
            branch,
            imageData,
            fileName: file.name,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        
        editor.chain().focus().setImage({ src: data.imageUrl }).run();
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {/* Mobile-Optimized Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
              <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                <Link href="/dashboard" className="flex items-center space-x-1 md:space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div className="h-4 md:h-6 w-px bg-gray-300 flex-shrink-0" />
              <h1 className="text-sm md:text-lg font-semibold text-black truncate">Blog Editor</h1>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={triggerImageUpload}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
              </Button>

              <Button
                onClick={handlePublish}
                className="bg-black hover:bg-gray-800 text-white flex items-center space-x-2"
                disabled={isPublishing || !title || !editor?.getHTML()}
              >
                <Send className="w-4 h-4" />
                <span>{isPublishing ? "Publishing..." : "Publish"}</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Actions Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3 space-y-2 animate-fade-in">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center space-x-2"
                onClick={triggerImageUpload}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
              </Button>

              <Button
                onClick={() => {
                  handlePublish()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish to GitHub</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="relative grid grid-cols-1 gap-4 md:gap-8 min-h-[calc(100vh-200px)]">
          {/* Editor Panel */}
          <div className={`space-y-4`}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog title..."
                className="text-base md:text-lg font-semibold"
                disabled={isPublishing}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              {showFullPageSuccessAnimation ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 animate-fade-in">
                  <Send className="w-16 h-16 text-green-500 animate-bounce-in" />
                  <p className="mt-4 text-xl font-semibold text-green-600">Blog Published Successfully!</p>
                </div>
              ) : (
                <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm overflow-hidden">
                  <div className={`flex items-center space-x-1 border border-gray-200 rounded-md p-1 ${isPublishing ? "opacity-50" : ""}`}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            disabled={!editor?.can().toggleBold()}
                            className={editor?.isActive('bold') ? 'bg-gray-200' : ''}
                          >
                            <BoldIcon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bold</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            disabled={!editor?.can().toggleItalic()}
                            className={editor?.isActive('italic') ? 'bg-gray-200' : ''}
                          >
                            <ItalicIcon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Italic</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleStrike().run()}
                            disabled={!editor?.can().toggleStrike()}
                            className={editor?.isActive('strike') ? 'bg-gray-200' : ''}
                          >
                            <StrikethroughIcon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Strikethrough</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleCode().run()}
                            disabled={!editor?.can().toggleCode()}
                            className={editor?.isActive('code') ? 'bg-gray-200' : ''}
                          >
                            <CodeIcon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                            disabled={!editor?.can().toggleHeading({ level: 1 })}
                            className={editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
                          >
                            <Heading1 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Heading 1</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            disabled={!editor?.can().toggleHeading({ level: 2 })}
                            className={editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
                          >
                            <Heading2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Heading 2</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            disabled={!editor?.can().toggleBulletList()}
                            className={editor?.isActive('bulletList') ? 'bg-gray-200' : ''}
                          >
                            <List className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bullet List</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            disabled={!editor?.can().toggleOrderedList()}
                            className={editor?.isActive('orderedList') ? 'bg-gray-200' : ''}
                          >
                            <ListOrdered className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ordered List</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                            disabled={!editor?.can().toggleCodeBlock()}
                            className={editor?.isActive('codeBlock') ? 'bg-gray-200' : ''}
                          >
                            <Code2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Code Block</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().undo().run()}
                            disabled={!editor?.can().undo()}
                          >
                            <Undo2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Undo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor?.chain().focus().redo().run()}
                            disabled={!editor?.can().redo()}
                          >
                            <Redo2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Redo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <EditorContent editor={editor} />
                </div>
              )}
            </div>
          </div>
        </div>
        {publishMessage && !showFullPageSuccessAnimation && (
          <p className={`text-center mt-4 text-sm font-medium \
            ${publishMessage.startsWith("Error") ? "text-red-500" : "text-green-600"}
            ${showPublishSuccessAnimation ? "animate-fade-in-up" : ""}`}>
            {publishMessage}
          </p>
        )}
      </div>
    </div>
  )
}
