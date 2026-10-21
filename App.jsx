
import { useEffect, useState } from 'react'
import './App.css'

function Header() {
  return (
    <header className="header">
      <h1>TaskFlow</h1>
      <p>Atur tugasmu, capai tujuanmu.</p>
    </header>
  )
}

function TaskForm({ onAddTask }) {
  const [task, setTask] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (task.trim() === '') return

    onAddTask(task.trim())
    setTask('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tulis tugas baru..."
        value={task}
        onChange={(event) => setTask(event.target.value)}
      />
      <button type="submit">+ Tambah</button>
    </form>
  )
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <label className="task-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span>{task.title}</span>
      </label>

      <button
        className="delete-button"
        onClick={() => onDelete(task.id)}
        aria-label={`Hapus ${task.title}`}
      >
        Hapus
      </button>
    </div>
  )
}

function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">Belum ada tugas. Yuk, tambahkan tugasmu!</p>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('taskflow-tasks')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
    document.title = 'TaskFlow - Daftar Tugas'
  }, [tasks])

  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    }

    setTasks((currentTasks) => [...currentTasks, newTask])
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  function deleteTask(id) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    )
  }

  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <main className="container">
      <Header />

      <section className="task-card">
        <h2>Daftar Tugas Saya</h2>
        <p className="subtitle">Satu langkah kecil setiap hari.</p>

        <TaskForm onAddTask={addTask} />

        <div className="task-summary">
          <span>Total: {tasks.length} tugas</span>
          <span>Selesai: {completedCount}</span>
        </div>

        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </section>

      <footer>
        <p>TaskFlow © 2026 | Aplikasi Tugas Mandiri React.js</p>
      </footer>
    </main>
  )
}

export default App
