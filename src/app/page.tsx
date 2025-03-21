"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "@/components/VideoFeed";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import Layout from "@/components/Layout";
import Link from "next/link";
import { FaFire, FaUpload, FaSearch } from "react-icons/fa";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<IVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        const allVideos = Array.isArray(data) ? data : [data];
        setVideos(allVideos);
        
        // Set featured videos (e.g., first 3 videos)
        setFeaturedVideos(allVideos.slice(0, 3));
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className=" px-4">
        <div className="container mx-auto px-4 text-center border-blue-100">
          <h1 className="text-3xl font-bold mb-4">Reels App</h1>
          <p className="text-xl mb-8">Share your moments with the world</p>
        
        </div>
      </section>


      {/* Upload CTA */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className=" rounded-xl p-8 border border-blue-100">
          <FaUpload className="mx-auto text-blue-500 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Ready to share your own reels?</h2>
          <p className="text-gray-600 mb-6">Upload your videos and share them with friends and followers</p>
          <Link href="/upload" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition">
            Start Uploading
          </Link>
        </div>
      </section>

      {/* All Videos Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Explore All Reels</h2>
        <VideoFeed videos={videos} />
      </section>
    </Layout>
  );
}