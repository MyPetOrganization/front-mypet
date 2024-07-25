'use client'

import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useLoading } from "@/hooks/useLoading";

export default function RegisterPage() {
  const { finishLoading, isLoading, startLoading } = useLoading()
  const authFetch = useAuthFetch()

  const register = async (formData: any) => {
    // console.log(formData)
    startLoading()
    await authFetch({
      endpoint: 'auth/register',
      redirectRoute: '/login',
      formData,
    })
    finishLoading()
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
            {/* <Form.Input
              placeholder='Confirma tu contraseña...'
              label='Confirma tu Contraseña'
              name='confirmPassword'
              type='password'
            /> */}
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
