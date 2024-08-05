'use client'

import { Form } from "@/components/Form";
import NotificationContext from "@/context/NotificationContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useLoading } from "@/hooks/useLoading";
// import HomePage from "./home/page";
import { useContext, useState } from "react";

export default function LoginPage() {
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
        const { email, password, role } = formData;

        if (!email || !password || !role) {
            showNotification({
                msj: "Todos los campos son obligatorios.",
                open: true,
                status: 'error'
            })
            return false;
        }

        // if (!validateEmail(email) || !validatePassword(password)) {
        if (!validateEmail(email)) {
            showNotification({
                msj: "Credenciales incorrectas.",
                open: true,
                status: 'error'
            })
            return false;
        }
        return true;
    }

    const login = async (formData: any) => {
        if (validateInputs(formData)) {
            startLoading()
            await authFetch({
                endpoint: 'auth/login',
                formData,
            })
            finishLoading()
        }
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
                            options={[{ label: "Dueño de mascota", value: "buyer" }, { label: "Emprendedor", value: "seller" }]}
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
