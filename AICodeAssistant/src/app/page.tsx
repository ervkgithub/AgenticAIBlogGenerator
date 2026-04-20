'use client'

import React from 'react'
import Sidebar, { Mode } from './components/Sidebar'
import FileSystemHandler, { FileItem } from './components/FileSystemHandler'
import WorkspaceEditor from './components/WorkspaceEditor'
import AIEngine from './components/AIEngine'
import { parseFiles, extractCodeBlock } from './lib/parser'

export default function Home() {
  const [activeMode, setActiveMode] = React.useState<Mode>('create')
  const [files, setFiles] = React.useState<FileItem[]>([])
  const [activeFilePath, setActiveFilePath] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [currentResponse, setCurrentResponse] = React.useState('')
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const activeFileContent = React.useMemo(() => {
    return files.find(f => f.path === activeFilePath)?.content || null
  }, [files, activeFilePath])

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true)
    setCurrentResponse('')
    setActiveFilePath(null)
    setFiles([])

    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          mode: activeMode,
          // We can add model selection here if needed
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) throw new Error('Generation failed')

      const reader = response.body?.getReader()
      if (!reader) return

      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        accumulated += chunk
        setCurrentResponse(accumulated)

        // Periodically parse files to show progress in tree
        const parsed = parseFiles(accumulated)
        if (parsed.length > 0) {
          setFiles(parsed)
          if (!activeFilePath && parsed[0]) {
            setActiveFilePath(parsed[0].path)
          }
        } else if (accumulated.includes('```')) {
          // If not in full file format, try extracting a single block
          const code = extractCodeBlock(accumulated)
          setFiles([{ path: 'generated_code.tsx', content: code }])
          setActiveFilePath('generated_code.tsx')
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generation aborted')
      } else {
        console.error('Error generating code:', error)
      }
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    abortControllerRef.current?.abort()
  }

  const handleFileUpload = (uploadedFiles: FileItem[]) => {
    setFiles(prev => [...prev, ...uploadedFiles])
    if (!activeFilePath && uploadedFiles[0]) {
      setActiveFilePath(uploadedFiles[0].path)
    }
  }

  return (
    <main className="flex h-screen bg-obsidian overflow-hidden text-foreground">
      {/* Left Sidebar */}
      <Sidebar activeMode={activeMode} onModeChange={setActiveMode} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer (Inner Sidebar) */}
          <FileSystemHandler 
            files={files} 
            activeFile={activeFilePath} 
            onFileSelect={setActiveFilePath} 
            onFileUpload={handleFileUpload}
          />

          {/* Code Viewer */}
          <WorkspaceEditor 
            fileName={activeFilePath} 
            content={activeFileContent} 
          />
        </div>

        {/* AI Control Bar */}
        <AIEngine 
          mode={activeMode} 
          onGenerate={handleGenerate} 
          isGenerating={isGenerating} 
          onStop={handleStop}
        />
      </div>
    </main>
  )
}