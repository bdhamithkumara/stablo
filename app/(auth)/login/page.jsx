'use client'
import { signinWithGoogle } from '@/actions/googlesignin'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
    <form className='flex flex-col gap-2'>
        <input type="hidden" name="next" value="/dashboard" />
      <button className='btn' formAction={signinWithGoogle('/dashboard')}>
        Sign in with Google
      </button>
    </form>
    </div>
  )
}

export default Page