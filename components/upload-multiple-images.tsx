"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, XCircle, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { toast } from "@/hooks/use-toast"
import { showToast } from "@/lib/utils"

interface ImageData {
  secure_url: string
  public_id: string
  _id?: string
}

interface UploadMultipleImagesProps {
  label: string
  initialImages?: ImageData[]
  maxImages?: number
  onChange: (files: File[]) => void
  onRemove?: (index: number) => Promise<void>
  imageRequired?: boolean
}

export function UploadMultipleImages({ 
  label, 
  initialImages = [], 
  maxImages = 3, 
  onChange, 
  onRemove,
  imageRequired = false
}: UploadMultipleImagesProps) {
  const { t } = useLanguage()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialImages.map(img => img.secure_url)
  )
  const [dragActive, setDragActive] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const initialMountRef = useRef(true)

  // Notify parent about initial state after component mounts
  useEffect(() => {
    // Only call onChange on initial mount
    if (initialMountRef.current && initialImages.length === 0 && selectedFiles.length === 0) {
      onChange([])
      initialMountRef.current = false
    }
  }, [initialImages.length, selectedFiles.length])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // Check if adding these files would exceed the limit
    const totalImagesCount = previewUrls.length + files.length
    if (totalImagesCount > maxImages) {
      showToast.error(t, "error", "max.images.limit", t("max.images.limit").replace('{0}', maxImages.toString()))
      return
    }
    
    // Add new files to selectedFiles array
    const newFiles = Array.from(files)
    const updatedFiles = [...selectedFiles, ...newFiles]
    setSelectedFiles(updatedFiles)
    onChange(updatedFiles)
    
    // Create preview URLs for new files
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      
      // Check if adding these files would exceed the limit
      const totalImagesCount = previewUrls.length + droppedFiles.length
      if (totalImagesCount > maxImages) {
        showToast.error(t, "error", "max.images.limit", t("max.images.limit").replace('{0}', maxImages.toString()))
        return
      }
      
      const updatedFiles = [...selectedFiles, ...droppedFiles]
      setSelectedFiles(updatedFiles)
      onChange(updatedFiles)
      
      // Create preview URLs for dropped files
      droppedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = async (index: number) => {
    try {
      setIsDeleting(true)
      
      // If this is an existing image and we have an onRemove handler
      if (index < initialImages.length && onRemove) {
        await onRemove(index)
      }
      
      // Update preview URLs
      setPreviewUrls(prev => prev.filter((_, i) => i !== index))
      
      // Update selected files (if it's a newly added file)
      if (index >= initialImages.length) {
        const newSelectedFilesIndex = index - initialImages.length
        const updatedFiles = selectedFiles.filter((_, i) => i !== newSelectedFilesIndex)
        setSelectedFiles(updatedFiles)
        onChange(updatedFiles)
      } else {
        // If we've removed an existing image, ensure onChange is called with current files
        onChange(selectedFiles)
      }
    } catch (error) {
      console.error("Error removing image:", error)
      showToast.error(t, "error", "image.delete.error")
    } finally {
      setIsDeleting(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  console.log("UploadMultipleImages - selectedFiles:", selectedFiles.length, "previewUrls:", previewUrls.length)

  // Check if file is an image
  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      showToast.error(t, "error", "file.type.invalid");
      return false;
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const sizeMessage = t("file.size.limit.message").replace('{size}', "5MB");
      showToast.error(t, "error", "file.size.too.large", sizeMessage);
      return false;
    }
    
    return true;
  };

  return (
    <div className="space-y-4 col-span-1 md:col-span-2">
      <Label htmlFor={`upload-multiple-${label}`}>{label}</Label>
      
      <div className="space-y-4">
        <div 
          className={`relative border-2 border-dashed rounded-lg p-5 transition-all duration-200 flex flex-col items-center justify-center h-44 ${
            dragActive ? "border-[#BB2121] bg-red-50" : "border-gray-300 hover:border-[#BB2121] hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Input
            id={`upload-multiple-${label}`}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
            multiple
          />
          
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-[#BB2121]" />
          </div>
          <p className="text-gray-700 text-sm font-medium mb-1">{t("drag.or.upload")}</p>
          <p className="text-gray-500 text-xs mb-3">
            {previewUrls.length > 0 
              ? `${previewUrls.length}/${maxImages} ${t("images.added")}`
              : t("supported.formats")}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            className="inline-flex items-center gap-1.5 text-sm border-[#BB2121] text-[#BB2121] hover:bg-red-50"
            disabled={previewUrls.length >= maxImages}
          >
            <Plus className="w-4 h-4" />
            <span>{t("add.image")}</span>
          </Button>
        </div>
        
        {/* Image previews */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative h-48 w-full rounded-md overflow-hidden shadow-sm border border-gray-200">
                  <Image
                    src={url}
                    alt={`${t("preview")} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-80 hover:opacity-100"
                  onClick={() => removeImage(index)}
                  disabled={isDeleting}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {imageRequired && previewUrls.length === 0 && (
          <p className="text-sm text-red-500">* {t("image.required")}</p>
        )}
      </div>
    </div>
  )
} 