"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, Upload, FileVideo, Check } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const videoUrl = watch("videoUrl");

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    setUploadComplete(true);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(data);
      showNotification("Video published successfully!", "success");

      // Reset form after successful submission
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
      setUploadComplete(false);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2 mb-6">
            <Upload className="h-5 w-5 text-primary" />
            Upload New Video
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video details form fields */}
              <div className="space-y-4 md:col-span-1">
                <div className="form-control">
                  <label className="label font-medium">Title</label>
                  <input
                    type="text"
                    placeholder="Give your video a catchy title"
                    className={`input input-bordered w-full ${
                      errors.title ? "input-error" : ""
                    }`}
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <span className="text-error text-sm mt-1">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label font-medium">Description</label>
                  <textarea
                    placeholder="Describe your video content..."
                    className={`textarea textarea-bordered h-32 w-full ${
                      errors.description ? "textarea-error" : ""
                    }`}
                    {...register("description", { required: "Description is required" })}
                  />
                  {errors.description && (
                    <span className="text-error text-sm mt-1">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Video upload and preview section */}
              <div className="md:col-span-1">
                <div className="border border-base-300 rounded-lg p-4 h-full flex flex-col">
                  {!videoUrl ? (
                    <>
                      <div className="flex items-center justify-center h-40 bg-base-200 rounded-lg mb-4">
                        <FileVideo className="h-12 w-12 text-base-content opacity-40" />
                      </div>
                      <div className="form-control">
                        <label className="label font-medium flex justify-between">
                          <span>Upload Video</span>
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <span className="text-sm text-primary">{uploadProgress}%</span>
                          )}
                        </label>
                        <FileUpload
                          fileType="video"
                          onSuccess={handleUploadSuccess}
                          onProgress={handleUploadProgress}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="aspect-video rounded-lg overflow-hidden bg-base-300 mb-4">
                        <video 
                          src={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${videoUrl}`} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-success">
                        <Check className="h-5 w-5" />
                        <span>Video uploaded successfully</span>
                      </div>
                    </>
                  )}
                  
                  {/* Progress bar */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-base-200 rounded-full h-3 mt-4 overflow-hidden">
                      <div
                        className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="card-actions justify-end mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !uploadComplete}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : uploadProgress > 0 && uploadProgress < 100 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Publish Video"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Upload Tips */}
      <div className="card bg-base-100 shadow-sm mt-6">
        <div className="card-body">
          <h3 className="text-lg font-medium mb-2">Upload Tips</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-base-content/80">
            <li>Maximum file size: 100MB</li>
            <li>Supported formats: MP4, WebM</li>
            <li>Recommended resolution: 1080p or higher</li>
            <li>Add descriptive titles for better discoverability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}