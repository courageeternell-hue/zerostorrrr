"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

type AuthUser = {
  id: string
  name: string
  email: string
  handle: string
}

function mapUser(user: User | null): AuthUser | null {
  if (!user) return null

  const email = user.email ?? ""
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    email.split("@")[0] ||
    "Pengguna"

  return {
    id: user.id,
    name,
    email,
    handle: `@${email.split("@")[0] || "pengguna"}`,
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setUser(mapUser(data.user))
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setUser(mapUser(session?.user ?? null))
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  async function signUp(name: string, email: string, password: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) throw error
  }

  async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  }

  return {
    user,
    signedIn: Boolean(user),
    loading,
    signIn,
    signUp,
    signOut,
  }
}
