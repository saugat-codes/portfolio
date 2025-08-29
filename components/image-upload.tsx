"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { uploadImage, validateImageFile } from "@/lib/upload"

interface ImageUploadProps {
  value?: string
  onChange: (imageUrl: string) => void
  label?: string
  required?: boolean
}

export default function ImageUpload({ value, onChange, label = "Image", required = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")
    
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setUploading(true)
    
    try {
      const imageUrl = await uploadImage(file)
      onChange(imageUrl)
    } catch (err) {
      setError("Failed to upload image")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">
        {label} {required && "*"}
      </Label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {value ? (
        <div className="space-y-3">
          <div className="relative group">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-700"
            />
            <Button
              type="button"
              onClick={handleRemove}
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            onClick={triggerFileSelect}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Change Image"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div 
            onClick={triggerFileSelect}
            className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-600 transition-colors"
          >
            <ImageIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Click to upload an image</p>
            <p className="text-sm text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
          </div>
          
          {uploading && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                Uploading...
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}
