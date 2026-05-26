"use client"

import { useApp, Member } from "@/context/AppContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TaskTable" 
import { MemberForm } from "@/components/MemberForm"
import { useState } from "react"
import { SettingsForm } from "@/components/SettingsForm"

export default function DashboardPage() {
  const { projects, deleteProject, members, deleteMember, tasks } = useApp()
  const [memberFormOpen, setMemberFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard de Proyectos
          </h1>
          <p className="text-slate-600">
            Gestiona tus proyectos y tareas con shadcn/ui
          </p>
          <div className="pt-4">
            <ProjectForm />
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              {/* Total Proyectos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {projects.filter(p => p.status === "En progreso").length} en progreso
                  </p>
                </CardContent>
              </Card>

              {/* Tareas Completadas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.status === "Completado").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tasks.length} tareas en total
                  </p>
                </CardContent>
              </Card>

              {/* Tareas Pendientes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.status === "Pendiente").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tasks.filter(t => t.status === "En progreso").length} en progreso
                  </p>
                </CardContent>
              </Card>

              {/* Miembros Activos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {members.filter(m => m.isActive).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {members.length} miembros en total
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Fila inferior: Proyectos por estado + Actividad reciente */}
            <div className="grid gap-4 md:grid-cols-2">

              {/* Proyectos por estado */}
              <Card>
                <CardHeader>
                  <CardTitle>Proyectos por Estado</CardTitle>
                  <CardDescription>Distribución actual de proyectos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(["Planificado", "En progreso", "En revisión", "Completado"] as const).map(status => {
                    const count = projects.filter(p => p.status === status).length
                    const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{status}</span>
                          <span className="font-medium">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Actividad reciente */}
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas tareas registradas</CardDescription>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay tareas registradas.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {tasks.slice(-5).reverse().map(task => {
                        const member = members.find(m => m.userId === task.userId)
                        const project = projects.find(p => p.id === task.projectId)
                        return (
                          <div key={task.id} className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback>
                                {member ? member.name.split(" ").map(n => n[0]).join("") : "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium leading-none">
                                {member?.name ?? "Sin asignar"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {task.description}{" "}
                                <span className="font-medium">{project?.name ?? ""}</span>
                              </p>
                            </div>
                            <Badge variant={
                              task.status === "Completado" ? "default" :
                              task.status === "En progreso" ? "secondary" : "outline"
                            }>
                              {task.status}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects" className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay proyectos. Crea uno con el botón de arriba.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            project.status === "Completado"
                              ? "default"
                              : project.status === "En revisión"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            {project.memberIds.length} miembro(s)
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              Ver detalles
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteProject(project.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Miembros del Equipo</CardTitle>
                    <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
                  </div>
                  <Button onClick={() => { setEditingMember(null); setMemberFormOpen(true) }}>
                    + Nuevo Miembro
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No hay miembros registrados.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role} — {member.position}</p>
                            <p className="text-xs text-muted-foreground">{member.email} · {member.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.isActive ? "default" : "secondary"}>
                            {member.isActive ? "Activo" : "Ausente"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setEditingMember(member); setMemberFormOpen(true) }}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm("¿Eliminar este miembro?")) deleteMember(member.userId)
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <MemberForm
              open={memberFormOpen}
              onClose={() => { setMemberFormOpen(false); setEditingMember(null) }}
              editingMember={editingMember}
            />
          </TabsContent>
          
          {/* Tab: Tasks */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>
                  Administra todas las tareas de tus proyectos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Administra las preferencias de tu cuenta y del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
