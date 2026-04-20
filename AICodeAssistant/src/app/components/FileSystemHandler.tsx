'use client'

import React from 'react'
import { File, Folder, ChevronDown, ChevronRight, Upload, Terminal } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface FileItem {
  path: string
  content: string
}

interface Props {
  files: FileItem[]
  activeFile: string | null
  onFileSelect: (path: string) => void
  onFileUpload: (files: FileItem[]) => void
}

export default function FileSystemHandler({ files, activeFile, onFileSelect, onFileUpload }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles: FileItem[] = []
    const filesList = e.target.files
    if (!filesList) return

    Array.from(filesList).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        uploadedFiles.push({
          path: file.name,
          content: event.target?.result as string
        })
        if (uploadedFiles.length === filesList.length) {
          onFileUpload(uploadedFiles)
        }
      }
      reader.readAsText(file)
    })
  }

  return (
    <div className="w-64 h-full flex flex-col border-r border-white/5 bg-obsidian-light/50 backdrop-blur-sm">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Explorer</span>
        <button 
          onClick={handleUploadClick}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white"
          title="Upload files for debugging"
        >
          <Upload className="h-3.5 w-3.5" />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            onChange={handleFileChange}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <Terminal className="h-8 w-8 text-white/10 mb-2" />
            <p className="text-[10px] text-muted-foreground">No files generated or uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => onFileSelect(file.path)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200 group",
                  activeFile === file.path 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                )}
              >
                <File className={cn(
                  "h-3.5 w-3.5",
                  activeFile === file.path ? "text-primary" : "opacity-60"
                )} />
                <span className="truncate flex-1 text-left">{file.path}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span>Local System Connected</span>
        </div>
      </div>
    </div>
  )
}
