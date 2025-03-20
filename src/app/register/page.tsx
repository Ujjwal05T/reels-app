'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

function Register() {
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [confirmPassword, setConfirmPassword] = React.useState('');
   const [error, setError] = React.useState('');
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(password !== confirmPassword){
         setError('Passwords do not match')
         return
      }
      try {
         const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
         })
         const data = response.json()
         if(response.ok){
            router.push('/login')
         }
         else{
            setError('Failed to register')
         }
      } catch (error) {
         setError('Failed to register')
      }
   }
  return (
    <div>Register</div>
  )
}

export default Register