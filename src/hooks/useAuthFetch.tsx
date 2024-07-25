import NotificationContext from '@/context/NotificationContext'
import axios, { AxiosRequestConfig } from 'axios'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import Cookies from 'js-cookie'

interface AuthFetchProps {
  endpoint: string
  redirectRoute?: string
  formData: any
  options?: AxiosRequestConfig<any>
}

export function useAuthFetch () {
  const { showNotification } = useContext(NotificationContext)
  const router = useRouter()

  const authRouter = async ({
    endpoint,
    formData,
    redirectRoute,
    options
  }: AuthFetchProps) => {
    try {
      const { data } = await axios.post(
        `http://localhost:3001/api/${endpoint}`,
        formData,
        options
      );

      showNotification({
        msj: "Inicio de sesión exitoso",
        open: true,
        status: 'success'
      })

      if(endpoint === 'auth/login') {
        console.log(data)
        Cookies.set('auth_cookie', data.token, { expires: 7 })
        Cookies.set('role', data.user.role, { expires: 7 })
        localStorage.setItem('id_user', data.user.id)
        // localStorage.setItem('role', data.user.role)

        // Configurar el encabezado con el rol del usuario
        // axios.defaults.headers.common['x-user-role'] = data.user.role

        // Redirigir basado en el rol
        if (data.user.role === 'seller') {
          router.push('/home')
        } else if (data.user.role === 'buyer') {
          router.push('/')
        }
      }

    } catch (error: any) {
      showNotification({
        msj: "Credenciales incorrectas",
        open: true,
        status: 'error'
      })
    }
  }

  return authRouter
}
