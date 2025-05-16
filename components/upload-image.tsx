"use client"

import { useState } from "react"
import { Upload, XCircle, Camera } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"

interface UploadImageProps {
  label: string
  initialImage?: string
  onChange: (file: File | null) => void
  onRemove?: () => void
}

export function UploadImage({ label, initialImage, onChange, onRemove }: UploadImageProps) {
  const { t } = useLanguage()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null)
  const [dragActive, setDragActive] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      onChange(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setImageFile(file)
      onChange(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    onChange(null)
    if (onRemove) onRemove()
  }

  const inputId = `upload-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className="space-y-4">
      <Label htmlFor={inputId}>{label}</Label>
      <div 
        className={`relative border-2 border-dashed rounded-lg p-5 transition-all duration-200 flex flex-col items-center justify-center ${
          dragActive ? "border-[#BB2121] bg-red-50" : "border-gray-300 hover:border-[#BB2121] hover:bg-gray-50"
        } ${imagePreview ? "h-auto py-4" : "h-44"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        
        {imagePreview ? (
          <div className="relative w-full flex flex-col items-center">
            <div className="relative h-48 w-48 rounded-md overflow-hidden shadow-sm border border-gray-200">
              <Image
                src={imagePreview}
                alt="Image preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById(inputId)?.click()}
                className="text-xs flex items-center gap-1.5 border-[#BB2121] text-[#BB2121] hover:bg-red-50"
              >
                <Camera className="w-3.5 h-3.5" />
                {t("change.image")}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={removeImage}
                className="text-xs flex items-center gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                <XCircle className="w-3.5 h-3.5" />
                {t("remove")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-[#BB2121]" />
            </div>
            <p className="text-gray-700 text-sm font-medium mb-1">{t("drag.or.upload")}</p>
           
            <label
              htmlFor={inputId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#BB2121] text-white rounded-md cursor-pointer hover:bg-[#C20000] transition-colors duration-200 text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>{t("choose.image")}</span>
            </label>
          </>
        )}
      </div>
    </div>
  )
} 