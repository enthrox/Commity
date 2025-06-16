import { Suspense } from "react"
import { BlogEditor } from "@/components/blog-editor"

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading editor...</div>}>
      <BlogEditor />
    </Suspense>
  )
}
