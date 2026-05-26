import { z } from 'zod'

export const departmentTypes = [
  'contabilidad',
  'finanzas',
  'tesoreria',
  'talentos',
  'operaciones'
] as const

/* Auth */
export const authSchema = z.object({
    name: z.string(),
    apellido_paterno: z.string(),
    apellido_materno: z.string(),
    telefono: z.string().max(9, 'El teléfono debe tener máximo 9 caracteres').regex(/^\d+$/, 'Solo se permiten números'),
    email: z.string().email(),
    username: z.string(),
    department: z.enum(departmentTypes),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})
type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'username' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'apellido_paterno' | 'apellido_materno' | 'telefono' | 'email' | 'username' | 'department' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email' >
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
export type ConfirmToken = Pick<Auth, 'token'>
export type CheckPasswordForm = Pick<Auth, 'password'>

/* Users */
export const roleSchema = z.object({
    _id: z.string(),
    name: z.string()
})
export type Role = z.infer<typeof roleSchema>

export const areaSchema = z.object({
    _id: z.string(),
    name: z.string()
})
export type Area = z.infer<typeof areaSchema>

export const userPerfilSchema = authSchema.pick({ 
    name: true, 
    apellido_paterno: true,
    email: true}).extend({
    _id: z.string(),
    dni: z.string().optional(),
    role: roleSchema.optional(),
    area: areaSchema.optional(),
    empresas: z.array(z.object({ _id: z.string(), nombre: z.string() })).default([])
})
export type User = z.infer<typeof userPerfilSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>

/* Admin - User list */
export const userAdminSchema = z.object({
    _id: z.string(),
    name: z.string(),
    apellido_paterno: z.string(),
    apellido_materno: z.string(),
    telefono: z.string(),
    username: z.string(),
    email: z.string(),
    dni: z.string().optional(),
    department: z.string(),
    confirmed: z.boolean(),
    estado: z.boolean(),
    role: roleSchema.optional(),
    area: areaSchema.optional(),
    empresas: z.array(z.object({ _id: z.string(), nombre: z.string() })).default([])
})
export type UserAdmin = z.infer<typeof userAdminSchema>

/* Admin - User edit */
export const userEditSchema = userAdminSchema.omit({ _id: true, confirmed: true, estado: true, role: true }).extend({
    telefono: z.string().max(9, 'El teléfono debe tener máximo 9 caracteres').regex(/^\d+$/, 'Solo se permiten números'),
    dni: z.string()
      .max(8, "El DNI debe tener máximo 8 caracteres")
      .regex(/^\d+$/, "El DNI solo permite números")
      .optional(),
    empresas: z.array(z.string()).optional(),
    department: z.string(),
    area: z.string().optional(),
})
export type UserEditForm = z.infer<typeof userEditSchema>

/* Admin - Update profile payload */
export type UpdateUserProfilePayload = {
  name?: string
  apellido_paterno?: string
  apellido_materno?: string
  telefono?: string
  email?: string
  username?: string
  dni?: string
  empresas?: string[] // _ids de las sedes
  role?: string // _id del rol
  area?: string // _id del área
}

/* Admin - User create */
export const userCreateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  apellido_paterno: z.string().min(1, "El apellido paterno es obligatorio"),
  apellido_materno: z.string().min(1, "El apellido materno es obligatorio"),
  telefono: z.string().max(9, "Máximo 9 caracteres").regex(/^\d+$/, "Solo se permiten números"),
  dni: z.string()
    .min(1, "El DNI es obligatorio")
    .max(8, "El DNI debe tener máximo 8 caracteres")
    .regex(/^\d+$/, "El DNI solo permite números"),
  username: z.string().min(1, "El username es obligatorio"),
  email: z.string().email("E-mail no válido").optional().or(z.literal("")),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  empresas: z.array(z.string()).min(1, "Selecciona al menos una sede"),
  role: z.string().optional(),
  area: z.string().optional(),
})
export type UserCreateForm = z.infer<typeof userCreateSchema>