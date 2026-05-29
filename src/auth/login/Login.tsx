import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserLoginForm } from "../validation";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authenticate } from "../../api/auth.api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import InputField from "../../components/ui/InputField";

interface ApiErrors {
  username?: string;
  password?: string;
  general?: string;
}

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 1 1 8 0v4" />
  </svg>
)

export default function Login() {

  const [showPassword, setShowPassword] = useState(false)
  const [apiErrors, setApiErrors] = useState<ApiErrors>({})
  const initialValues: UserLoginForm = {username: '',password: ''}
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('inactivo') === 'true') {
      Swal.fire({
        icon: 'info',
        title: 'Cuenta desactivada',
        text: 'Tu cuenta ha sido desactivada por un administrador. No puedes continuar en el sistema.',
        confirmButtonColor: 'var(--brand-primary)'
      })
    }
  }, [])
  
  const {mutate} = useMutation({
    mutationFn: authenticate,
    onError: (error: any) => {
      if (error.field) {
        setApiErrors(prev => ({ ...prev, [error.field]: error.message }));
      } else {
        setApiErrors(prev => ({ ...prev, general: error.message }));
      }
    },
    onSuccess: () => {
      navigate('/dashboard')
    },
  })

  const handleLogin = (formData: UserLoginForm) => {
    setApiErrors({})
    mutate(formData)
  }

  const clearFieldError = (field: keyof ApiErrors) => {
    setApiErrors(prev => ({ ...prev, [field]: undefined }));
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
        Inicia Sesión
      </h2>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col gap-6"
        noValidate
      >
        <InputField
          id="username"
          label="Usuario"
          type="text"
          placeholder="Ingresa tu usuario"
          icon={<UserIcon />}
          error={errors.username?.message || apiErrors.username}
          {...register("username", {
            required: "El nombre de usuario es obligatorio",
            onChange: () => clearFieldError('username'),
          })}
        />

        <InputField
          id="password"
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          placeholder="Ingresa tu contraseña"
          icon={<LockIcon />}
          error={errors.password?.message || apiErrors.password}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          }
          {...register("password", {
            required: "El Password es obligatorio",
            onChange: () => clearFieldError('password'),
          })}
        />

        {apiErrors.general && (
          <p className="text-xs font-medium text-center text-red-500">{apiErrors.general}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:brightness-90 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          Iniciar Sesión
        </button>
      </form>
    </>
  )
}