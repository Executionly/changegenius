import React, { Suspense } from 'react'
import AuthForm from './AuthForm'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm />
    </Suspense>
  )
}

export default page