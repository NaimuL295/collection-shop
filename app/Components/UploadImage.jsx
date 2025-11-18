"use client";
import { useState } from "react";

export default function UploadImage({ onUpload }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        onUpload(data.url); // pass uploaded URL to parent
      } else {
        console.error("Upload failed:", data.error);
        alert("Upload failed, check console for details.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed, check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-2xl p-6 border border-gray-100">
      <h3 className="font-semibold text-lg mb-3">Upload Product Image</h3>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-48 h-48 rounded-xl object-cover mb-4"
        />
      ) : (
        <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          {loading ? "Uploading..." : "No Image Selected"}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="cursor-pointer"
      />
    </div>
  );
}
