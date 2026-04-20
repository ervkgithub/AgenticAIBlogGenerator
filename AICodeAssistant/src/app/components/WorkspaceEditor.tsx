'use client'

import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, ExternalLink, Download } from 'lucide-react'

interface Props {
  fileName: string | null
  content: string | null
}

export default function WorkspaceEditor({ fileName, content }: Props) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!fileName || content === null) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center text-center p-12 bg-obsidian text-muted-foreground">
        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 animate-pulse">
            <Copy className="h-8 w-8 opacity-20" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Workspace Ready</h2>
        <p className="max-w-xs text-sm">Select a file from the explorer or ask the AI to generate some code to start developing.</p>
      </div>
    )
  }

  const extension = fileName.split('.').pop() || 'typescript'
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'css': 'css',
    'html': 'html',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-obsidian overflow-hidden">
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-obsidian-light/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-2">
            {fileName}
            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold">Modified</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar font-mono text-sm leading-relaxed p-4">
        <SyntaxHighlighter
          language={languageMap[extension] || 'typescript'}
          style={atomDark}
          customStyle={{
            background: 'transparent',
            padding: 0,
            margin: 0,
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#4b5563',
            textAlign: 'right',
            userSelect: 'none',
          }}
          showLineNumbers={true}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
