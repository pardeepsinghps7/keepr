'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, {useEffect, useRef, useState} from "react";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import {createClient} from "@supabase/supabase-js";
import { toast } from 'react-hot-toast';
import { supabaseClient } from "@/lib/supabaseClient";

export default function AddAvatar() {
  // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  //   global: {
  //     headers: {
  //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6InBwaHlpV2NrQWtPeVlGRFQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3J0c3NndnJvaW1lZ3h0eWpham1pLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIxNGRhMzU3MS0zNjZlLTQ3NDAtYjc1ZC03MTYxOWQ4MzEzZTUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ3ODI3NDYzLCJpYXQiOjE3NDc4MjM4NjMsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdLCJyb2xlIjoiYWRtaW4ifSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDc4MjM4NjN9XSwic2Vzc2lvbl9pZCI6IjMxMWI0ZWRhLTY4MjAtNGM5My05Y2U2LTBiMzBkYTk3NzZiYyIsImlzX2Fub255bW91cyI6ZmFsc2V9.-pUt1LjQAy1IqN89Y03dFILAl7jpTqSTdzxlVh89398`,
  //     },
  //   },
  // });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {

    
    if (!file){
      return toast.error("Please select a file") ;
    }
      
    setUploading(true);
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return toast.error("Only PNG, JPG, and JPEG files are allowed.");
    }

    const filePath = `${Date.now()}_${file.name}`;

    const { error } = await supabaseClient.storage
        .from('avatars')
        .upload(filePath, file);

    if (error) {
      toast.error('Upload failed: ' + error.message);
    } else {
      const { data } = supabaseClient.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      const { error: insertError } = await supabaseClient
          .from('avatars')
          .insert([{ path: publicUrl }]);

      if (insertError) {
        toast.error('Failed to save avatar URL: ' + insertError.message);
      } else {
        toast.success('Avatar uploaded!');
        setFile(null);
        // fileInputRef.current && (fileInputRef.current.value = '');
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
