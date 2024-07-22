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
      // console.log(formData)
      const { data } = await axios.post(
        `http://localhost:3001/api/${endpoint}`,
        endpoint === "auth/login"
          ? { email: formData.email, password: formData.password }
          : formData,
        options
      );

      showNotification({
        msj: "Inicio de sesión exitoso",
        open: true,
        status: 'success'
      })

      if(endpoint === 'auth/login') {
        Cookies.set('auth_cookie', { data }.data.token, { expires: 7 })
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