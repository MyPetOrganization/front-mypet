import NotificationContext from '@/context/NotificationContext'
import axios, { AxiosRequestConfig } from 'axios'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import Cookies from 'js-cookie'
import HttpService from '@/helpers/HttpService'

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
        Cookies.set('auth_cookie', { data }.data.token, { expires: 7 })
        localStorage.setItem('id_user', { data }.data.user.id)
        // Cookies.set('id_user', data.id, { expires: 7 })
      };

      if (redirectRoute) router.push(redirectRoute)
    } catch (error: any) {
      // console.log(error)
      showNotification({
        msj: "Credenciales incorrectas",
        open: true,
        status: 'error'
      })
    }
  }

  return authRouter
}