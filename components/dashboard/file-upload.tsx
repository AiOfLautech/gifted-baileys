'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onUploadSuccess?: () => void
  accept?: string
  botId?: string
  autoUpload?: boolean
}

export function FileUpload({ 
  onFileSelect, 
  onUploadSuccess,
  accept = '.json',
  botId,
  autoUpload = false
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setError(null)
      onFileSelect(file)
      
      if (autoUpload && botId) {
        await uploadFile(file)
      }
    }
  }

  const uploadFile = async (file: File) => {
    if (!botId) {
      setError('Bot ID is required')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/bots/${botId}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      onUploadSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setFileName(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleClick}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 p-6 transition hover:border-muted-foreground/70"
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
        <p className="mt-2 text-sm font-medium">
          {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-muted-foreground">JSON files only</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {fileName && (
        <div className="flex items-center justify-between rounded-lg bg-muted p-3">
          <span className="text-sm">{fileName}</span>
          <button 
            onClick={handleClear} 
            className="text-muted-foreground hover:text-foreground"
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
