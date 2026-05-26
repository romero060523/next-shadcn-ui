"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useApp, Member } from "@/context/AppContext"

const emptyForm = {
  name: "",
  email: "",
  role: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: "",
  isActive: true,
}

interface MemberFormProps {
  open: boolean
  onClose: () => void
  editingMember?: Member | null
}

export function MemberForm({ open, onClose, editingMember }: MemberFormProps) {
  const { addMember, updateMember, projects } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ ...emptyForm })
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Sincronizar cuando se abre para editar
  useState(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        email: editingMember.email,
        role: editingMember.role,
        position: editingMember.position,
        birthdate: editingMember.birthdate,
        phone: editingMember.phone,
        projectId: editingMember.projectId,
        isActive: editingMember.isActive,
      })
      setDate(editingMember.birthdate ? new Date(editingMember.birthdate) : undefined)
    } else {
      setFormData({ ...emptyForm })
      setDate(undefined)
    }
    setError("")
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim())     { setError("El nombre es obligatorio."); return }
    if (!formData.email.trim())    { setError("El email es obligatorio."); return }
    if (!formData.role.trim())     { setError("El rol es obligatorio."); return }
    if (!formData.position.trim()) { setError("La posición es obligatoria."); return }
    if (!formData.phone.trim())    { setError("El teléfono es obligatorio."); return }

    setLoading(true)
    await new Promise(res => setTimeout(res, 1200))
    setLoading(false)

    if (editingMember) {
      updateMember({
        ...editingMember,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.trim(),
        position: formData.position.trim(),
        birthdate: formData.birthdate,
        phone: formData.phone.trim(),
        projectId: formData.projectId,
        isActive: formData.isActive,
      })
    } else {
      addMember({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.trim(),
        position: formData.position.trim(),
        birthdate: formData.birthdate,
        phone: formData.phone.trim(),
        projectId: formData.projectId,
        isActive: formData.isActive,
      })
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose() }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingMember ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
            <DialogDescription>
              {editingMember ? "Modifica los datos del miembro." : "Completa la información del nuevo miembro."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Nombre */}
            <div className="grid gap-2">
              <Label>Nombre <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Nombre completo"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* Rol */}
            <div className="grid gap-2">
              <Label>Rol <span className="text-destructive">*</span></Label>
              <Select
                value={formData.role}
                onValueChange={v => setFormData({ ...formData, role: v })}
                disabled={loading}
              >
                <SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                  <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                  <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Posición */}
            <div className="grid gap-2">
              <Label>Posición <span className="text-destructive">*</span></Label>
              <Select
                value={formData.position}
                onValueChange={v => setFormData({ ...formData, position: v })}
                disabled={loading}
              >
                <SelectTrigger><SelectValue placeholder="Selecciona una posición" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Teléfono */}
            <div className="grid gap-2">
              <Label>Teléfono <span className="text-destructive">*</span></Label>
              <Input
                placeholder="999-000-000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className="grid gap-2">
              <Label>Fecha de Nacimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
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
                        birthdate: d ? format(d, "yyyy-MM-dd") : "",
                      })
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Proyecto asignado */}
            <div className="grid gap-2">
              <Label>Proyecto Asignado</Label>
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

            {/* Estado activo */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Miembro Activo</Label>
                <p className="text-sm text-muted-foreground">
                  Indica si el miembro está activo en el equipo
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={v => setFormData({ ...formData, isActive: v })}
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Guardando...
                </span>
              ) : editingMember ? "Guardar cambios" : "Crear Miembro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}