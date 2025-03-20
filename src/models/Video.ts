import mongoose, { Schema, model, models } from "mongoose";

export const VideoDimensions = {
   width:1080,
   height:1920
}

export interface IVideo {
   title: string;
   description: string;
   id?: mongoose.Types.ObjectId;
   videoUrl: string;
   thumbnailUrl: string;
   controls?: boolean;
   transformation?: {
      height: number;
      width: number;
      quality?: number;
   };
   createdAt?: Date;
   updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>({
   title: {type: String, required: true},
   description: {type: String, required: true},
   videoUrl: {type: String, required: true},
   thumbnailUrl: {type: String, required: true},
   controls: {type: Boolean, default: true},
   transformation: {
      height: {type: Number, default: VideoDimensions.height},
      width: {type: Number, default: VideoDimensions.width},
      quality: {type: Number, default: 100}
   }
},{timestamps:true})

const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video;