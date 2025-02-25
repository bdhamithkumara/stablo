'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const AdminPage = () => {
  const [role, setRole] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login') // Redirect if not logged in
        return
      }

      // Fetch user role
      const { data, error } = await supabase
        .from('profiles') // Your user table
        .select('role')
        .eq('id', user.id)
        .single()

      if (!error && data?.role !== 'admin') {
        router.push('/dashboard') // Redirect non-admins
      } else {
        setRole(data?.role)
      }
    }

    checkAdmin()
  }, [supabase, router])

  if (role !== 'admin') {
    return <p>Checking permissions...</p>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
    </div>
  )
}

export default AdminPage
