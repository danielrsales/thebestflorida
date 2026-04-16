'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  bucket: string
  path: string           // e.g. "contractors/123/logo"
  value?: string | null  // current URL
  onChange: (url: string | null) => void
  label?: string
  aspectRatio?: 'square' | 'wide'
  maxSizeMB?: number
}

export function ImageUpload({
  bucket,
  path,
  value,
  onChange,
  label = 'Upload image',
  aspectRatio = 'square',
  maxSizeMB = 5,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be under ${maxSizeMB} MB.`)
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files are accepted.')
      return
    }

    setError('')
    setUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const filePath = `${path}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      onChange(data.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      // Reset input so same file can be re-uploaded
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove() {
    if (!value) return
    const supabase = createClient()
    // Extract storage path from URL
    const url = new URL(value)
    const storagePath = url.pathname.split(`/object/public/${bucket}/`)[1]
    if (storagePath) {
      await supabase.storage.from(bucket).remove([storagePath]).catch(() => null)
    }
    onChange(null)
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block group">
          <div className={cn(
            'overflow-hidden rounded-lg border bg-gray-50',
            aspectRatio === 'square' ? 'w-32 h-32' : 'w-64 h-36'
          )}>
            <Image
              src={value}
              alt="Uploaded"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg transition-colors text-gray-400 hover:border-blue-400 hover:text-blue-500',
            aspectRatio === 'square' ? 'w-32 h-32' : 'w-64 h-36',
            uploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
              <span className="text-[10px] mt-0.5">Max {maxSizeMB} MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
