"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Label } from "@/components/ui/label"

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
)

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  label,
  required = false
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-gray-300">
            {label} {required && "*"}
          </Label>
        )}
        <div className="bg-gray-700 border border-gray-600 rounded-md p-4 h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading editor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-gray-300">
          {label} {required && "*"}
        </Label>
      )}
      <div className="rich-text-editor">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          preview="edit"
          hideToolbar={false}
          visibleDragbar={false}
          textareaProps={{
        placeholder,
        style: {
          fontSize: 14,
          backgroundColor: "#1f2937",
          color: "#10b981",
          border: "1px solid #4b5563",
          borderRadius: "0.375rem",
        },
          }}
          height={400}
          data-color-mode="dark"
        />
      </div>
      <style jsx global>{`
        .rich-text-editor .w-md-editor {
          background-color: #374151 !important;
          border: 1px solid #4b5563 !important;
          border-radius: 0.375rem !important;
        }
        
        .rich-text-editor .w-md-editor-text-container,
        .rich-text-editor .w-md-editor-text,
        .rich-text-editor .w-md-editor-text-input,
        .rich-text-editor .w-md-editor-text-textarea {
          background-color: #1f2937 !important;
          color: #10b981 !important;
          border: none !important;
        }
        
        .rich-text-editor .w-md-editor-toolbar {
          background-color: #4b5563 !important;
          border-bottom: 1px solid #6b7280 !important;
        }
        
        .rich-text-editor .w-md-editor-toolbar button {
          color: #d1d5db !important;
          background-color: transparent !important;
          border: none !important;
        }
        
        .rich-text-editor .w-md-editor-toolbar button:hover {
          background-color: #6b7280 !important;
          color: #ffffff !important;
        }
        
        .rich-text-editor .w-md-editor-toolbar button.active {
          background-color: #059669 !important;
          color: #ffffff !important;
        }
        
        .rich-text-editor .w-md-editor-toolbar li {
          border-right: 1px solid #6b7280 !important;
        }
        
        .rich-text-editor .w-md-editor-text-container .token.title {
          color: #60a5fa !important;
        }
        
        .rich-text-editor .w-md-editor-text-container .token.bold {
          color: #fbbf24 !important;
        }
        
        .rich-text-editor .w-md-editor-text-container .token.code {
          color: #34d399 !important;
          background-color: #1f2937 !important;
        }
        
        .rich-text-editor .w-md-editor-text-container .token.url {
          color: #a78bfa !important;
        }
      `}</style>
    </div>
  )
}
