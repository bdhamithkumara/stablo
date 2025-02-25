'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const DashboardPage = () => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login') // Redirect if not logged in
      } else {
        setUser(user)

        // Fetch user role from database
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!error) {
          setRole(data?.role)
        }
      }
    }

    fetchUser()
  }, [supabase, router])

  return (
    <div className="p-8">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
          <p>Your role: {role ? role : 'Loading...'}</p>

          {role === 'admin' ? (
            <p className="text-green-600">You have admin access.</p>
          ) : (
            <p className="text-blue-600">You are a regular user.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default DashboardPage
