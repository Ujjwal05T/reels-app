import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";


export default function Home() {

  const [videos,setVideos] = useState<IVideo[]>([]);

  useEffect(()=>{
    const fetchVideos = async()=>{
      try {
        const data = await apiClient.getVideos()
        //might be error
          setVideos(Array.isArray(data) ? data : [data]);
        
      } catch (error) {
        console.error("Error fetching videos:",error)
      }
    }
    fetchVideos();
  },[])

  return (
    <>
    
    </>
  );
}
