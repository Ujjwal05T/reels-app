import { dbConnect } from "@/lib/db";
import { authOptions } from "@/lib/options";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { IVideo } from '../../../models/Video';


export async function GET() {
   try {
      await dbConnect();
      const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
      if(!videos || videos.length === 0){
         return NextResponse.json({ message: "No videos found" }, { status: 404 })
      }
      return NextResponse.json(videos)
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
   }
}

export async function POST(req:NextRequest) {
   try {
      const session = await getServerSession(authOptions)
      if(!session){
         return NextResponse.json({ error: "You need to be authenticated to create a video" }, { status: 401 })  
   } 
   await dbConnect();
   const body:IVideo=await req.json()
   if(!body.title || !body.videoUrl || !body.description || !body.thumbnailUrl){
      return NextResponse.json({ error: "Please provide all required fields" }, { status: 400 })
   }
   const videodata = {
      ...body ,
      controls:body.controls ?? true,
      transformation:{
         height:1920,
         width:1080,
         quality:body.transformation?.quality ?? 100,
      }
      
   }
   const video = await Video.create(videodata)
   return NextResponse.json(video)
}
catch (error) {
   console.log(error)
      return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
   }
}