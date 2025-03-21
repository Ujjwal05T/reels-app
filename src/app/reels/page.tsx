"use client";

import React, { useEffect, useState } from "react";
import ReelsFeed from "@/components/ReelsFeed";
import Layout from "@/components/Layout";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { AlertCircle, Loader } from "lucide-react";

export default function ReelsPage() {
  const [reels, setReels] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getVideos();
        setReels(Array.isArray(data) ? data : [data]);
        setError(null);
      } catch (error) {
        console.error("Error fetching reels:", error);
        setError("Failed to load reels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-2 py-4 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 md:mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            Reels
          </h1>
        </motion.div>
        
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center h-[70vh]"
          >
            <Loader className="w-10 h-10 text-purple-600 animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading amazing reels...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="alert alert-error bg-red-100 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 backdrop-blur-sm rounded-xl shadow-md"
          >
            <AlertCircle className="stroke-current shrink-0 h-6 w-6" />
            <span>{error}</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ReelsFeed videos={reels} />
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
