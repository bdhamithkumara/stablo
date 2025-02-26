'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const signInWith = provider => async (next = '/dashboard') => {
  const supabase = await createClient()

const auth_callback_url = `${process.env.SITE_URL}/callback?next=${encodeURIComponent(next)}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  })

  console.log(data)

  if (error) {
    console.log(error)
  }

  redirect(data.url)
}

const signinWithGoogle = signInWith('google')

const signOut = async () => {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
}

export { signinWithGoogle, signOut }