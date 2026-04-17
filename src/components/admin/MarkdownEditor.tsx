'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { commands } from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus } from 'lucide-react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export function MarkdownEditor({ value, onChange, height = 500 }: MarkdownEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `editor-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) {
      alert('Upload failed: ' + error.message)
      return null
    }

    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }

  const insertImageAtCursor = (url: string) => {
    const markdown = `![image](${url})`
    const textarea = document.querySelector<HTMLTextAreaElement>('.w-md-editor-text-input')

    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.slice(0, start) + markdown + value.slice(end)
      onChange(newValue)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + markdown.length
        textarea.focus()
      }, 0)
    } else {
      onChange(value + '\n' + markdown)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await handleImageUpload(file)
    if (url) {
      insertImageAtCursor(url)
    }
    // Reset input
    e.target.value = ''
  }

  const imageUploadCommand = {
    name: 'image-upload',
    keyCommand: 'image-upload',
    buttonProps: { 'aria-label': 'Upload image', title: 'Upload image' },
    icon: (
      <span className="flex items-center justify-center w-3 h-3">
        <ImagePlus size={12} />
      </span>
    ),
    execute: () => {
      fileInputRef.current?.click()
    },
  }

  return (
    <div data-color-mode="light">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        height={height}
        preview="live"
        visibleDragbar={false}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.title,
          commands.divider,
          commands.link,
          commands.quote,
          commands.code,
          commands.codeBlock,
          imageUploadCommand,
          commands.image,
          commands.table,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
          commands.divider,
          commands.help,
        ]}
      />
    </div>
  )
}
