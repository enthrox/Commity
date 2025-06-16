import { Suspense } from "react"
import GenericEditor from './GenericEditor'

export default function GenericEditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading editor...</div>}>
      <GenericEditor />
    </Suspense>
  )
}
