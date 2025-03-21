import { IVideo } from "@/models/Video";
import { useState, useEffect } from "react";
import ReelComponent from "./ReelComponent";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReelsFeedProps {
  videos: IVideo[];
}

export default function ReelsFeed({ videos }: ReelsFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset currentIndex when videos change
  useEffect(() => {
    if (currentIndex >= videos.length) {
      setCurrentIndex(0);
    }
  }, [videos, currentIndex]);

  const handleNext = () => {
    if (videos.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    if (videos.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
    );
  };

  useEffect(() => {
    const handleSwipe = (e: TouchEvent) => {
      const touchStartY = e.touches[0].clientY;
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const touchEndY = moveEvent.touches[0].clientY;
        if (touchStartY - touchEndY > 50) {
          handleNext();
          document.removeEventListener("touchmove", handleTouchMove);
        } else if (touchEndY - touchStartY > 50) {
          handlePrev();
          document.removeEventListener("touchmove", handleTouchMove);
        }
      };
      document.addEventListener("touchmove", handleTouchMove);
    };

    document.addEventListener("touchstart", handleSwipe);

    return () => {
      document.removeEventListener("touchstart", handleSwipe);
    };
  }, []);

  if (videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm p-8">
        <p className="text-gray-500 dark:text-gray-400">No reels found</p>
      </motion.div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-md mx-auto h-[80vh] md:h-[85vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full relative rounded-xl overflow-hidden">
          <ReelComponent video={videos[currentIndex]} />
          
          {/* Navigation buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 btn btn-circle btn-sm md:btn-md bg-gradient-to-r from-violet-500/80 to-purple-600/80 text-white border-none shadow-lg hover:shadow-purple-300/50 transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous reel">
            <ChevronLeft size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 btn btn-circle btn-sm md:btn-md bg-gradient-to-r from-violet-500/80 to-purple-600/80 text-white border-none shadow-lg hover:shadow-purple-300/50 transition-all duration-300 backdrop-blur-sm"
            aria-label="Next reel">
            <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Reel indicators */}
      <div className="flex justify-center space-x-2 mt-4 absolute bottom-4 z-20 left-0 right-0">
        {videos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "bg-purple-600 w-4"
                : "bg-gray-300/70 dark:bg-gray-700/70 hover:bg-purple-400/70 dark:hover:bg-purple-800/70"
            }`}
            aria-label={`Go to reel ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
