import NotificationContext from '@/context/NotificationContext'
import axios, { AxiosRequestConfig } from 'axios'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import Cookies from 'js-cookie' // Import the 'Cookies' module

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
        `http://localhost:3001/${endpoint}`,
        formData,
        options
      )

      showNotification({
        msj: data.message,
        open: true,
        status: 'success'
      })

      console.log(data)

      if(endpoint === 'auth/login') {
        Cookies.set('auth_cookie', data.token, { expires: 7 })
        Cookies.set('id_user', data.id, { expires: 7 })
      };

      if (redirectRoute) router.push(redirectRoute)
    } catch (error: any) {
      showNotification({
        msj: error.response.data.message as string,
        open: true,
        status: 'error'
      })
    }
  }

  return authRouter
}