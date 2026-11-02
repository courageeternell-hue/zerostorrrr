import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Konfigurasi Supabase belum lengkap')
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        response = NextResponse.next({ request })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()


  const pathname = request.nextUrl.pathname

  let isAdmin = false

  if (user) {
    const { data } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    isAdmin = Boolean(data)
  }

  const isAdminRoute =
    pathname === '/admin' || pathname.startsWith('/admin/')

  if (isAdminRoute && !isAdmin) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.search = ''

    const redirectResponse = NextResponse.redirect(redirectUrl)

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })

    return redirectResponse
  }

  if (!isAdmin) {
    const isMaintenancePage = pathname === '/maintenance'

    if (!isMaintenancePage) {
      const { data: settings, error } = await supabase
        .from('site_settings')
        .select('maintenance_enabled, maintenance_eta')
        .eq('id', 1)
        .maybeSingle()

      // Fail-closed: jika status tidak bisa dipastikan, blokir pengunjung.
      let maintenanceActive = Boolean(error || !settings)

      if (settings?.maintenance_enabled) {
        const eta = settings.maintenance_eta
          ? new Date(settings.maintenance_eta).getTime()
          : null

        // ETA kosong atau tidak valid berarti Maintenance tetap aktif.
        maintenanceActive =
          eta === null || !Number.isFinite(eta) || eta > Date.now()
      } else if (settings && !error) {
        maintenanceActive = false
      }

      if (maintenanceActive) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'ZERO STORE sedang dalam Maintenance.' },
            { status: 503 }
          )
        }

        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/maintenance'
        redirectUrl.search = ''

        const redirectResponse = NextResponse.redirect(redirectUrl)

        response.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie)
        })

        return redirectResponse
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
