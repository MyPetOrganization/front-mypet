import NotificationContext from '@/context/NotificationContext'
import axios, { AxiosRequestConfig } from 'axios'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import Cookies from 'js-cookie'
import { URL_BASE } from '@/config'

interface AuthFetchProps {
  endpoint: string
  redirectRoute?: string
  formData: any
  options?: AxiosRequestConfig<any>
}

export function useAuthFetch() {
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
        `${URL_BASE}${endpoint}`,
        formData,
        options
      );

      showNotification({
        msj: "Inicio de sesión exitoso",
        open: true,
        status: 'success'
      })

      if (endpoint === 'auth/login') {
        const expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + (2 * 60 * 60 * 1000));

        console.log(data)
        Cookies.set('auth_cookie', data.token, { httpOnly: false, expires: expirationTime }) // Cmabiar a true en producción
        Cookies.set('role', data.user.role, { httpOnly: false, expires: expirationTime }) // Cmabiar a true en producción

        localStorage.setItem('id_user', data.user.id)
        localStorage.setItem('name', data.user.name)

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
