"use client";
import React, {  useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps{
   onSuccess:(res:IKUploadResponse)=>void;
   onProgress:(progress:number)=>void;
   fileType?:'image'|'video';
}




export default function FileUpload({onSuccess,onProgress,fileType='image'}:FileUploadProps) {

   const [uploading,setUploading]=useState(false);
   const [error, setError] = useState<string | null>(null);
   
const onError = (err:{message:string}) => {
   console.log("Error", err);
   setError(err.message);
   setUploading(false);
 };
 
 const handleSuccess = (res:IKUploadResponse) => {
   console.log("Success", res);
   setUploading(false);
   setError(null);
   onSuccess(res);
 };
 
 const handleUploadProgress = (evt:ProgressEvent) => {
   if(evt.lengthComputable && onProgress){
      const progress = Math.round((evt.loaded / evt.total) * 100);
      onProgress(progress);
   }
 };
 
 const handleUploadStart = () => {
   setUploading(true);
   setError(null)
 };

 const validateFile = (file:File) => {
   if (fileType === 'video') {
      if(!file.type.startsWith('video/')){
         setError('Please upload a video file')
         return false
   }
   if(file.size>100 * 1024 * 1024){
      setError('Video size should be less than 100MB')
      return false
   } 
 }else{
      const validTypes = ['image/jpeg','image/png','image/jpg','image/webp']
      if(!validTypes.includes(file.type)){
         setError('Please upload a valid image file(JPEF,PNG,JPG,webP)')
         return false
      }
      if(file.size>10 * 1024 * 1024){
         setError('Image size should be less than 10MB')
         return false
      }
 }
 return true
 }
  return (
    <div className="space-y-2">
        <IKUpload
          fileName={fileType==='video' ? 'video' : 'image'}
          useUniqueFileName={true}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          accept={fileType==='video' ? '/videos/*' : '/images/*'}
          onUploadProgress={handleUploadProgress}
          onUploadStart={handleUploadStart}
          className="file-input file-input-bordered w-full"
          folder={fileType==='video' ? '/videos' : '/images'}
        />
        {uploading && (
         <div className="text-primary flex items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin"/>
            <p>Uploading...</p>
         </div>
        )}
        {error && (
         <div className="text-error text-sm">
            {error}
         </div>
        )}
    </div>
  );
}