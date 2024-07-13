import axios from 'axios'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware (request: NextRequest) {
  try {
    const token = request.cookies.get('auth_cookie')

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const resp = await axios.get('http://localhost:3001/auth/check', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    const data = await resp.data;

    // @ts-ignore
    if (!data.isAuthorized) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: '/home'
}