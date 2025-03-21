import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
   const {email, password} = await request.json();
   if(!email || !password) {
     return NextResponse.json({error: "Email and password are required"}, {status: 400});
   }
   await dbConnect();
   const user = await User.findOne({email});
   if(user) {
     return NextResponse.json({error: "User already exists"}, {status: 400});}

   await User.create({email, password});
   return NextResponse.json({message: "User created successfully"}, {status: 201});
  } catch (error) {
    console.log(error)
   return NextResponse.json({error: "Failed to Register user"}, {status: 500});
  }
}