'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, {useRef, useState} from "react";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import {createClient} from "@supabase/supabase-js";

export default function AddAvatar() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6InBwaHlpV2NrQWtPeVlGRFQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3J0c3NndnJvaW1lZ3h0eWpham1pLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmOTlkMDkxMy1iNDlmLTRjZjgtODU3MS03ODAwZTE3YmY4MmEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ3NzI2NjAyLCJpYXQiOjE3NDc3MjMwMDIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQ3NzIzMDAyfV0sInNlc3Npb25faWQiOiJhYmVkYzk3My0xYWMxLTQxMjAtYmQyYy1jN2Y1NTA5YmNjODMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.9V6jJrtVolYACAqKkCsW1kJIkDA6XN9Fra6S1tqAWnY`,
      },
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    setUploading(true);
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return alert('Only PNG, JPG, and JPEG files are allowed.');
    }

    const filePath = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (error) {
      alert('Upload failed: ' + error.message);
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      const { error: insertError } = await supabase
          .from('avatars')
          .insert([{ url: publicUrl }]);

      if (insertError) {
        alert('Failed to save avatar URL: ' + insertError.message);
      } else {
        alert('Avatar uploaded!');
        setFile(null);
        fileInputRef.current && (fileInputRef.current.value = '');
      }
    }
    setUploading(false);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Upload Avatar" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <ComponentCard title="Select Image">
            <div>
              <Label>Upload file</Label>
              <input ref={fileInputRef}
                  type="file" accept=".png, .jpg, .jpeg, image/png, image/jpeg"
                  className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400`}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-brand-500 text-white rounded"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
