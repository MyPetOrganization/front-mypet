import axios from 'axios'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { URL_BASE } from './config'

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_cookie')
    const role = request.cookies.get('role')
    const url = request.nextUrl.clone()

    // Si no hay token y no estamos en la página de login, redirigir a la página de login
    if (!token && url.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Crear una respuesta para modificar las cookies
    const response = NextResponse.next();

    // Si hay token, verificarlo
    if (token) {
      const resp = await axios.get(`${URL_BASE}auth/verify`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      const data = await resp.data

      // Si el token no es autorizado, redirigir a la página de login
      if (!data.token) {
        return NextResponse.redirect(new URL('/login', request.url))
      } else {
        
        // Establecer la cookie de autenticación
        response.cookies.set('auth_cookie', data.token, {
          httpOnly: false, // Cambiar a true en producción
          secure: false, // Cambiar a true en producción
          // path: '/',
          maxAge: 60 * 60 * 2 
        })
      }

      // Redirigir basado en el rol del usuario
      if (role && role.value === 'seller') {
        if (url.pathname === '/' || url.pathname === '/login') {
          return NextResponse.redirect(new URL('/home', request.url))
        } else if (!url.pathname.startsWith('/home')) {
          return NextResponse.redirect(new URL('/home', request.url))
        }
      } else if (role && role.value === 'buyer') {
        if (url.pathname === '/' || url.pathname === '/login') {
          return NextResponse.redirect(new URL('/duenos-mascotas', request.url))
        } else if (!url.pathname.startsWith('/duenos-mascotas')) {
          return NextResponse.redirect(new URL('/duenos-mascotas', request.url))
        }
      }
    }

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/home', '/duenos-mascotas']
}
