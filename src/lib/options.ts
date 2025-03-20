import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions = {
   // Configure one or more authentication providers
   providers: [
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            email: { label: "Email", type: "text" },
            password: {  label: "Password", type: "password" }
         },
         async authorize(credentials) {
            if(!credentials?.email || !credentials?.password){
               throw new Error("Missing credentials")
            }
            try {
               await dbConnect()
               const user = await User.findOne({email:credentials.email})

               if(!user){
                  throw new Error("User not found")
               }
               const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
               if(!isPasswordCorrect){
                  throw new Error("Password incorrect")
               }
               return {email: user.email, id: user._id.toString()}
            } catch (error) {
               throw error
            }
         }
      })
   ],
   callbacks: {
      async jwt({token, user}){
         if(user){
            token.id = user.id
         }
         return token

      },
      async session({session, token}){
         if(session.user){
            session.user.id = token.id as string
         }
         return session
      }
   },
   pages: {
      signIn: "/auth/signin",
      error: "/auth/error",

   },
   session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
   },
   secret: process.env.SECRET,
}

