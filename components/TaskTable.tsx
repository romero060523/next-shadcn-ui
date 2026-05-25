"use client"

import { useState } from "react"
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useApp, Task, Priority, TaskStatus } from "@/context/AppContext"

const ITEMS_PER_PAGE = 4

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado": return "default"
    case "En progreso": return "secondary"
    default: return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "urgent": return "destructive"
    case "high": return "default"
    case "medium": return "secondary"
    default: return "outline"
  }
}

const priorityLabel: Record<string, string> = {
  low: "Baja", medium: "Media", high: "Alta", urgent: "Urgente"
}

const emptyForm = {
  description: "",
  projectId: "",
  status: "" as TaskStatus | "",
  priority: "" as Priority | "",
  userId: "",
  deadline: "",
}

export function TasksTable() {
  const { tasks, members, projects, addTask, updateTask, deleteTask } = useApp()

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({ ...emptyForm })
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Paginación
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
  const paginated = tasks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const openCreate = () => {
    setEditingTask(null)
    setFormData({ ...emptyForm })
    setDate(undefined)
    setError("")
    setDialogOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      userId: task.userId,
      deadline: task.deadline,
    })
    setDate(task.deadline ? new Date(task.deadline) : undefined)
    setError("")
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.description.trim()) { setError("La descripción es obligatoria."); return }
    if (!formData.projectId)          { setError("Debes seleccionar un proyecto."); return }
    if (!formData.status)             { setError("Debes seleccionar un estado."); return }
    if (!formData.priority)           { setError("Debes seleccionar una prioridad."); return }
    if (!formData.userId)             { setError("Debes asignar un responsable."); return }
    if (!formData.deadline)           { setError("Debes seleccionar una fecha límite."); return }

    setLoading(true)
    await new Promise(res => setTimeout(res, 1200))
    setLoading(false)

    if (editingTask) {
      updateTask({
        ...editingTask,
        description: formData.description.trim(),
        projectId: formData.projectId,
        status: formData.status as TaskStatus,
        priority: formData.priority as Priority,
        userId: formData.userId,
        deadline: formData.deadline,
      })
    } else {
      addTask({
        description: formData.description.trim(),
        projectId: formData.projectId,
        status: formData.status as TaskStatus,
        priority: formData.priority as Priority,
        userId: formData.userId,
        deadline: formData.deadline,
      })
    }

    setDialogOpen(false)
    setFormData({ ...emptyForm })
    setDate(undefined)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return
    deleteTask(id)
    // Ajustar página si queda vacía
    const newTotal = Math.ceil((tasks.length - 1) / ITEMS_PER_PAGE)
    if (page > newTotal && newTotal > 0) setPage(newTotal)
  }

  const getMemberName = (userId: string) =>
    members.find(m => m.userId === userId)?.name ?? userId

  const getProjectName = (projectId: string) =>
    projects.find(p => p.id === projectId)?.name ?? projectId

  return (
    <div className="space-y-4">
      {/* Botón crear */}
      <div className="flex justify-end">
        <Button onClick={openCreate}>+ Nueva Tarea</Button>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {tasks.length === 0
              ? "No hay tareas registradas."
              : `Mostrando ${paginated.length} de ${tasks.length} tareas`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Checkbox /></TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((task) => (
              <TableRow key={task.id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>{getProjectName(task.projectId)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(task.priority)}>
                    {priorityLabel[task.priority] ?? task.priority}
                  </Badge>
                </TableCell>
                <TableCell>{getMemberName(task.userId)}</TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(task)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <Button
                  variant={page === i + 1 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Dialog crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={(val) => { setDialogOpen(val); setError("") }}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
              <DialogDescription>
                {editingTask ? "Modifica los datos de la tarea." : "Completa la información de la nueva tarea."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Descripción */}
              <div className="grid gap-2">
                <Label>Descripción <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Descripción de la tarea..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Proyecto */}
              <div className="grid gap-2">
                <Label>Proyecto <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.projectId}
                  onValueChange={v => setFormData({ ...formData, projectId: v })}
                  disabled={loading}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona un proyecto" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="grid gap-2">
                <Label>Estado <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.status}
                  onValueChange={v => setFormData({ ...formData, status: v as TaskStatus })}
                  disabled={loading}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona el estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prioridad */}
              <div className="grid gap-2">
                <Label>Prioridad <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.priority}
                  onValueChange={v => setFormData({ ...formData, priority: v as Priority })}
                  disabled={loading}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona la prioridad" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Responsable */}
              <div className="grid gap-2">
                <Label>Responsable <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.userId}
                  onValueChange={v => setFormData({ ...formData, userId: v })}
                  disabled={loading}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona un miembro" /></SelectTrigger>
                  <SelectContent>
                    {members.map(m => (
                      <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha límite con Calendar */}
              <div className="grid gap-2">
                <Label>Fecha límite <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date
                        ? format(date, "PPP", { locale: es })
                        : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d)
                        setFormData({
                          ...formData,
                          deadline: d ? format(d, "yyyy-MM-dd") : "",
                        })
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Guardando...
                  </span>
                ) : editingTask ? "Guardar cambios" : "Crear Tarea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}