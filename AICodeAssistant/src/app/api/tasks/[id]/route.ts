import { NextRequest, NextResponse } from 'next/server'

let tasks: Array<{
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
  createdAt: string
}> = []

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const index = tasks.findIndex(task => task.id === params.id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    tasks[index] = { ...tasks[index], ...body }
    
    return NextResponse.json(tasks[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const index = tasks.findIndex(task => task.id === params.id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    tasks.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}