"use client";
import {
  useAddPhotoMutation,
  useDeletePhotoMutation,
} from "@/query/photoMutation";
import { Photo } from "@/types/type";
import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";

const PhotoGrid = ({ photos }: { photos: Photo[] }) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const addMutation = useAddPhotoMutation();
  const deleteMutation = useDeletePhotoMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    const supabase = createClient();
    const cleanFileName = file.name
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9-._]/g, "");
    const filePath = `public/${Date.now()}-${cleanFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      setUploading(false);
      return;
    }

    const { data: urlData } = await supabase.storage
      .from("photos")
      .getPublicUrl(uploadData.path);

    addMutation.mutate({
      imageURL: urlData.publicUrl,
      caption: caption,
    });

    setFile(null);
    setCaption("");
    (e.target as HTMLFormElement).reset();
    setUploading(false);
  };

  return (
    <main className="container mx-auto p-4">
      {/* 사진 추가 폼 */}
      <div className="my-8 p-6 border rounded-lg shadow-md bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Upload New Photo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-700"
            >
              Caption
            </label>
            <input
              id="caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700"
            >
              Photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
            disabled={uploading || addMutation.isPending}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>

      {/* 사진 목록 (기존 코드) */}
      <h1 className="text-4xl font-bold my-8">Photos</h1>
      <div className="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
        {photos?.map((photo) => (
          // ... (이전과 동일한 카드 렌더링 코드) ...
          <div
            key={photo.id}
            className="group relative w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md"
          >
            <img
              src={photo.image_url || ""}
              alt={photo.caption || ""}
              className="aspect-square w-full object-cover"
            />
            <div className="p-4">
              <p className="truncate text-sm text-gray-700">
                {photo.caption || "No caption"}
              </p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(photo.id)}
              className="absolute top-2 right-2 rounded-full bg-red-500/80 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
              disabled={deleteMutation.isPending}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PhotoGrid;
