'use client'

import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useLoading } from "@/hooks/useLoading";
// import HomePage from "./home/page";
import { useState } from "react";

export default function LoginPage() {
    const { finishLoading, isLoading, startLoading } = useLoading()
    const authFetch = useAuthFetch()
    const [open, setOpen] = useState(false);

    const login = async (formData: any) => {
        startLoading()
        await authFetch({
            endpoint: 'auth/login',
            // redirectRoute: '/home',
            // redirectRoute: `${formData.role === 'buyer' ? '/' : formData.role === 'seller' ? '/home' : ''}`,
            formData,
        })
        finishLoading()
    }

    return (
        <>
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <Form
                    title='Inicia Sesión'
                    onSubmit={login}
                    description='Formulario para iniciar sesión'
                >
                    <div className='my-[10px] flex flex-col gap-4'>
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
                        <Form.Select 
                            label="Rol"
                            name="role"
                            options={[ {label: "Dueño de mascota", value: "buyer"}, {label: "Emprendedor", value: "seller"} ]}
                            placeholder="Selecciona un rol"
                        />
                    </div>
                    <Form.SubmitButton
                        buttonText='Iniciar Sesión'
                        isLoading={isLoading}
                    />
                    <Form.Footer
                        description='¿Te olvidate tu contraseña?'
                        link='/change-password'
                        textLink='Recuperar contraseña'
                    />
                    <Form.Footer
                        description='¿Aun no tienes cuenta?'
                        link='/register'
                        textLink='Registrate'
                    />
                </Form>
            </div>
        </>
    );
}
