'use client'

import React from 'react'
import { 
  FolderPlus, 
  Code2, 
  Bug, 
  History, 
  Settings, 
  Cpu,
  ChevronRight,
  Database
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Mode = 'create' | 'edit' | 'debug'

interface Props {
  activeMode: Mode
  onModeChange: (mode: Mode) => void
}

export default function Sidebar({ activeMode, onModeChange }: Props) {
  const menuItems = [
    { id: 'create', icon: FolderPlus, label: 'New Project', description: 'End-to-end development' },
    { id: 'edit', icon: Code2, label: 'Code Query', description: 'Update existing code' },
    { id: 'debug', icon: Bug, label: 'AI Debugger', description: 'Fix & optimize code' },
  ]

  return (
    <div className="w-72 h-screen flex flex-col border-r border-white/10 glass-morphism z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <Cpu className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">AICodeAgent</h1>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Ollama Local
            </span>
          </div>
        </div>

        <nav className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-3">Modes</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onModeChange(item.id as Mode)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                activeMode === item.id 
                  ? "bg-white/10 text-white shadow-xl translate-x-1" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-300",
                activeMode === item.id ? "scale-110" : "group-hover:scale-110"
              )} />
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-[10px] opacity-60 font-medium">{item.description}</span>
              </div>
              {activeMode === item.id && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-3">Recent Context</p>
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
              <History className="h-3.5 w-3.5" />
              <span className="truncate">E-commerce API Integration</span>
              <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-white/10 space-y-4">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Local Memory</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-primary glow-primary rounded-full" />
          </div>
          <p className="text-[9px] text-muted-foreground mt-2">Using SQLite (Fallback) for projects</p>
        </div>
        
        <button className="flex items-center gap-3 w-full px-4 py-2 text-xs text-muted-foreground hover:text-white transition-colors">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}
