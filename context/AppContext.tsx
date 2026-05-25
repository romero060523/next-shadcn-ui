"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// ─── Types ───────────────────────────────────────────────
export type Priority = "low" | "medium" | "high" | "urgent"
export type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"
export type TaskStatus = "Pendiente" | "En progreso" | "Completado"

export interface Member {
  userId: string
  name: string
  email: string
  role: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  category: string
  priority: Priority
  status: ProjectStatus
  progress: number
  memberIds: string[]
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string
  deadline: string
}

// ─── Initial Data ─────────────────────────────────────────
const initialMembers: Member[] = [
  { userId: "u1", name: "María García",  email: "maria@example.com",  role: "Frontend Developer", position: "Senior",   birthdate: "1995-03-12", phone: "999-001", projectId: "p1", isActive: true  },
  { userId: "u2", name: "Juan Pérez",    email: "juan@example.com",   role: "Backend Developer",  position: "Mid",      birthdate: "1993-07-22", phone: "999-002", projectId: "p1", isActive: true  },
  { userId: "u3", name: "Ana López",     email: "ana@example.com",    role: "UI/UX Designer",     position: "Senior",   birthdate: "1997-01-05", phone: "999-003", projectId: "p2", isActive: false },
  { userId: "u4", name: "Carlos Ruiz",   email: "carlos@example.com", role: "DevOps Engineer",    position: "Senior",   birthdate: "1990-11-30", phone: "999-004", projectId: "p3", isActive: true  },
  { userId: "u5", name: "Laura Martínez",email: "laura@example.com",  role: "Project Manager",    position: "Lead",     birthdate: "1988-06-18", phone: "999-005", projectId: "p1", isActive: true  },
]

const initialProjects: Project[] = [
  { id: "p1", name: "E-commerce Platform",  description: "Plataforma de comercio electrónico con Next.js", category: "web",    priority: "high",   status: "En progreso", progress: 65,  memberIds: ["u1","u2","u5"] },
  { id: "p2", name: "Mobile App",           description: "Aplicación móvil con React Native",               category: "mobile", priority: "medium", status: "En revisión", progress: 90,  memberIds: ["u3"] },
  { id: "p3", name: "Dashboard Analytics",  description: "Panel de análisis con visualizaciones",           category: "web",    priority: "low",    status: "Planificado", progress: 20,  memberIds: ["u4"] },
  { id: "p4", name: "API Gateway",          description: "Microservicios con Node.js",                      category: "web",    priority: "high",   status: "En progreso", progress: 45,  memberIds: ["u2","u4"] },
  { id: "p5", name: "Design System",        description: "Librería de componentes reutilizables",           category: "design", priority: "medium", status: "Completado",  progress: 100, memberIds: ["u3"] },
  { id: "p6", name: "Marketing Website",    description: "Sitio web institucional",                         category: "marketing", priority: "medium", status: "En progreso", progress: 75, memberIds: ["u1"] },
]

const initialTasks: Task[] = [
  { id: "t1", description: "Implementar autenticación",  projectId: "p1", status: "En progreso", priority: "high",   userId: "u1", deadline: "2025-11-15" },
  { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente",   priority: "medium", userId: "u3", deadline: "2025-11-20" },
  { id: "t3", description: "Configurar CI/CD",           projectId: "p4", status: "Completado",  priority: "high",   userId: "u4", deadline: "2025-11-10" },
  { id: "t4", description: "Optimizar queries SQL",      projectId: "p1", status: "En progreso", priority: "urgent", userId: "u2", deadline: "2025-11-12" },
  { id: "t5", description: "Documentar API endpoints",   projectId: "p4", status: "Pendiente",   priority: "low",    userId: "u5", deadline: "2025-11-25" },
]

// ─── Context ──────────────────────────────────────────────
interface AppContextType {
  projects: Project[]
  members: Member[]
  tasks: Task[]
  addProject: (p: Omit<Project, "id">) => void
  updateProject: (p: Project) => void
  deleteProject: (id: string) => void
  addMember: (m: Omit<Member, "userId">) => void
  updateMember: (m: Member) => void
  deleteMember: (id: string) => void
  addTask: (t: Omit<Task, "id">) => void
  updateTask: (t: Task) => void
  deleteTask: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [members, setMembers]   = useState<Member[]>(initialMembers)
  const [tasks, setTasks]       = useState<Task[]>(initialTasks)

  const uid = () => Math.random().toString(36).slice(2, 9)

  // Projects
  const addProject    = (p: Omit<Project, "id">) => setProjects(prev => [...prev, { ...p, id: uid() }])
  const updateProject = (p: Project)             => setProjects(prev => prev.map(x => x.id === p.id ? p : x))
  const deleteProject = (id: string)             => setProjects(prev => prev.filter(x => x.id !== id))

  // Members
  const addMember    = (m: Omit<Member, "userId">) => setMembers(prev => [...prev, { ...m, userId: uid() }])
  const updateMember = (m: Member)                 => setMembers(prev => prev.map(x => x.userId === m.userId ? m : x))
  const deleteMember = (id: string)               => setMembers(prev => prev.filter(x => x.userId !== id))

  // Tasks
  const addTask    = (t: Omit<Task, "id">) => setTasks(prev => [...prev, { ...t, id: uid() }])
  const updateTask = (t: Task)             => setTasks(prev => prev.map(x => x.id === t.id ? t : x))
  const deleteTask = (id: string)         => setTasks(prev => prev.filter(x => x.id !== id))

  return (
    <AppContext.Provider value={{
      projects, members, tasks,
      addProject, updateProject, deleteProject,
      addMember, updateMember, deleteMember,
      addTask, updateTask, deleteTask,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}