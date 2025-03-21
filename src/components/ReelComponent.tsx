import { IVideo } from "@/models/Video";
import { IKVideo } from "imagekitio-next";
import { motion } from "framer-motion";

interface ReelComponentProps {
  video: IVideo;
}

export default function ReelComponent({ video }: ReelComponentProps) {
  return (
    <div className="relative w-full h-full flex flex-col bg-black rounded-xl overflow-hidden">
      <div className="flex-1 w-full h-full relative">
        <IKVideo
          path={video.videoUrl}
          transformation={[
            {
              height: "full",
              width: "auto"
            }
          ]}
          controls={true}
          loop={true}
          autoPlay={false}
          className="w-full h-full object-cover absolute inset-0"
        />
      </div>
      
      {/* Video info overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white"
      >
        <h3 className="font-bold text-lg mb-1">{video.title}</h3>
        <p className="text-sm text-gray-200 line-clamp-2">{video.description}</p>
      </motion.div>
    </div>
  );
}
