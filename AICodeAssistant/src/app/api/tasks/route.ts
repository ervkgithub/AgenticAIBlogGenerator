import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory storage (replace with database in production)
let tasks: Array<{
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
  createdAt: string
}> = []

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
})

if (typeof window === 'undefined') {
  // Initialize with sample data on server
  if (tasks.length === 0) {
    tasks = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Prepare and submit the quarterly project proposal',
        completed: false,
        priority: 'high',
        dueDate: '2026-04-25',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Review pull requests',
        description: 'Check and merge pending PRs from the team',
        completed: true,
        priority: 'medium',
        dueDate: null,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
  }
}

export async function GET() {
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = taskSchema.parse(body)
    
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      ...validated,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    tasks.unshift(newTask)
    
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}