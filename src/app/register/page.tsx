'use client'

import { Form } from "@/components/Form";
import NotificationContext from "@/context/NotificationContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useLoading } from "@/hooks/useLoading";
import { useContext } from "react";

export default function RegisterPage() {
  const { finishLoading, isLoading, startLoading } = useLoading()
  const authFetch = useAuthFetch()
  const { showNotification } = useContext(NotificationContext)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateInputs = (formData: any) => {
    const { name, email, password, favoriteMovie, role } = formData;

    if (!name || !email || !password || !favoriteMovie || !role) {
      showNotification({
        msj: "Todos los campos son obligatorios.",
        open: true,
        status: 'error'
      })
      return false;
    }

    if (!validateEmail(email)) {
      showNotification({
        msj: "El correo no es válido.",
        open: true,
        status: 'error'
      })
      return false;
    }

    if (!validatePassword(password)) {
      showNotification({
        msj: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.",
        open: true,
        status: 'error'
      })
      return false;
    }

    return true;
  }

  const register = async (formData: any) => {
    if (validateInputs(formData)) {
      startLoading()
      await authFetch({
        endpoint: 'auth/register',
        redirectRoute: '/login',
        formData,
      })
      finishLoading()
    }
  }

  return (
    <>
      <div className='min-h-screen flex flex-col items-center justify-center my-2'>
        <Form
          title='Crear un cuenta'
          onSubmit={register}
          description='Formulario para crear una cuenta'
        >
          <div className='my-[10px] flex flex-col gap-4'>
            <Form.Input
              label='Nombre'
              name='name'
              placeholder='Ingresa tu nombre...'
            />
            <Form.Input
              label='Correo'
              name='email'
              placeholder='Ingresa tu correo...'
            />
            <Form.Input
              placeholder='Ingresa tu contraseña...'
              label='Contraseña'
              name='password'
              type='password'
            />
            <Form.Input
              placeholder='¿Cuál es tu película favorita?'
              label='Pregunta de seguridad'
              name='favoriteMovie'
              type='text'
            />
            <Form.Select
              label="Rol"
              name="role"
              options={[{ label: "Dueño de mascota", value: "buyer" }, { label: "Emprendedor", value: "seller" }]}
              placeholder="Selecciona un rol"
            />
          </div>
          <Form.SubmitButton
            buttonText='Crear cuenta'
            isLoading={isLoading}
          />
          <Form.Footer
            description='¿Ya tienes cuenta?'
            link='/login'
            textLink='Iniciar sesión'
          />
        </Form>
      </div>
    </>
  );
}
