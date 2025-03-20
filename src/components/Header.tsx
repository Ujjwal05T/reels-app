'use client'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'


function Header() {
   const{data :session } = useSession();

   const handleSignOut = async()=>{
      try {
         await signOut()
         
      } catch (error) {
         
      }
   }
  return (
    <div>Header</div>
  )
}

export default Header