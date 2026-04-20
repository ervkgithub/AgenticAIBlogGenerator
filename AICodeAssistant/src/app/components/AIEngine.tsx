'use client'

import React from 'react'
import { Send, Zap, Sparkles, Loader2, StopCircle } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Props {
  mode: 'create' | 'edit' | 'debug'
  onGenerate: (prompt: string) => void
  isGenerating: boolean
  onStop: () => void
}

export default function AIEngine({ mode, onGenerate, isGenerating, onStop }: Props) {
  const [input, setInput] = React.useState('')
  const [model, setModel] = React.useState('llama3')

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (input.trim() && !isGenerating) {
      onGenerate(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const placeholders = {
    create: "Describe the app you want to build (e.g., 'A personal finance tracker with charts')...",
    edit: "Tell me what code to update or generate (e.g., 'Add a sorting feature to the list component')...",
    debug: "Paste your code or ask for help fixing a bug...",
  }

  return (
    <div className="w-full p-6 border-t border-white/5 bg-obsidian-light/50 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10">
            {['llama3', 'codellama', 'mistral'].map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
                  model === m ? "bg-primary text-white glow-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>AI Assistant is ready</span>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
          <div className="relative bg-obsidian-light border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-end gap-2 p-2 pl-4">
              <div className="mb-3">
                <Zap className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  isGenerating ? "text-primary animate-pulse" : "text-muted-foreground"
                )} />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholders[mode]}
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 h-auto max-h-32 min-h-[44px] no-scrollbar resize-none placeholder:text-muted-foreground/50"
                rows={1}
              />
              <div className="flex gap-2">
                {isGenerating ? (
                  <button
                    onClick={onStop}
                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"
                  >
                    <StopCircle className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      input.trim() 
                        ? "bg-primary text-white glow-primary" 
                        : "bg-white/5 text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {isGenerating && (
              <div className="h-1 w-full bg-white/5 overflow-hidden">
                <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-full" 
                  style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-6 text-[10px] text-muted-foreground font-medium uppercase tracking-widest px-2">
          <span>Alt + Enter for newline</span>
          <span className="w-1 h-1 rounded-full bg-white/20 mt-1.5" />
          <span>Ollama Endpoint: Localhost:11434</span>
        </div>
      </div>
    </div>
  )
}
