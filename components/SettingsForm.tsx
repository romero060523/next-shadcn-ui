"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const defaultSettings = {
  // Perfil
  companyName: "Mi Empresa",
  adminName: "Administrador",
  adminEmail: "admin@empresa.com",
  phone: "999-000-000",
  // Preferencias
  language: "es",
  timezone: "America/Lima",
  dateFormat: "dd/MM/yyyy",
  // Notificaciones
  emailNotifications: true,
  taskReminders: true,
  weeklyReport: false,
  // Sistema
  maxProjects: "20",
  maxMembers: "50",
  defaultPriority: "medium",
}

export function SettingsForm() {
  const [settings, setSettings] = useState({ ...defaultSettings })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const set = (key: string, value: string | boolean) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!settings.companyName.trim()) { setError("El nombre de la empresa es obligatorio."); return }
    if (!settings.adminEmail.trim())  { setError("El email del administrador es obligatorio."); return }

    setLoading(true)
    await new Promise(res => setTimeout(res, 1500))
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>¡Configuración guardada exitosamente!</AlertDescription>
        </Alert>
      )}

      {/* Perfil de la empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil de la Empresa</CardTitle>
          <CardDescription>Información general de tu organización</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Nombre de la Empresa <span className="text-destructive">*</span></Label>
            <Input
              value={settings.companyName}
              onChange={e => set("companyName", e.target.value)}
              disabled={loading}
              placeholder="Mi Empresa S.A.C."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Nombre del Administrador</Label>
              <Input
                value={settings.adminName}
                onChange={e => set("adminName", e.target.value)}
                disabled={loading}
                placeholder="Nombre completo"
              />
            </div>
            <div className="grid gap-2">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={settings.adminEmail}
                onChange={e => set("adminEmail", e.target.value)}
                disabled={loading}
                placeholder="admin@empresa.com"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Teléfono</Label>
            <Input
              value={settings.phone}
              onChange={e => set("phone", e.target.value)}
              disabled={loading}
              placeholder="999-000-000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferencias</CardTitle>
          <CardDescription>Configura el idioma, zona horaria y formato de fechas</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Idioma</Label>
              <Select value={settings.language} onValueChange={v => set("language", v)} disabled={loading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Zona Horaria</Label>
              <Select value={settings.timezone} onValueChange={v => set("timezone", v)} disabled={loading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Lima">América/Lima (UTC-5)</SelectItem>
                  <SelectItem value="America/Bogota">América/Bogotá (UTC-5)</SelectItem>
                  <SelectItem value="America/Santiago">América/Santiago (UTC-4)</SelectItem>
                  <SelectItem value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</SelectItem>
                  <SelectItem value="Europe/Madrid">Europa/Madrid (UTC+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Formato de Fecha</Label>
            <Select value={settings.dateFormat} onValueChange={v => set("dateFormat", v)} disabled={loading}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notificaciones</CardTitle>
          <CardDescription>Controla qué notificaciones deseas recibir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "emailNotifications", label: "Notificaciones por email", desc: "Recibe alertas de actividad por correo" },
            { key: "taskReminders",      label: "Recordatorio de tareas",   desc: "Aviso cuando una tarea está próxima a vencer" },
            { key: "weeklyReport",       label: "Reporte semanal",          desc: "Resumen de actividad cada lunes" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={settings[key as keyof typeof settings] as boolean}
                onCheckedChange={v => set(key, v)}
                disabled={loading}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sistema</CardTitle>
          <CardDescription>Límites y valores por defecto del sistema</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Máx. Proyectos</Label>
              <Input
                type="number"
                value={settings.maxProjects}
                onChange={e => set("maxProjects", e.target.value)}
                disabled={loading}
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label>Máx. Miembros</Label>
              <Input
                type="number"
                value={settings.maxMembers}
                onChange={e => set("maxMembers", e.target.value)}
                disabled={loading}
                min="1"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Prioridad por Defecto</Label>
            <Select value={settings.defaultPriority} onValueChange={v => set("defaultPriority", v)} disabled={loading}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              Guardando...
            </span>
          ) : "Guardar Configuración"}
        </Button>
      </div>

    </form>
  )
}