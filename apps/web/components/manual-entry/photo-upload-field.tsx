"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFileHandler } from "@/hooks/use-file-handler";

interface PhotoUploadFieldProps {
  imageUrl?: string;
  imagePublicId?: string;
  onUpload: (imageUrl: string, imagePublicId: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function PhotoUploadField({
  imageUrl,
  imagePublicId,
  onUpload,
  onRemove,
  disabled = false,
}: PhotoUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        // Step 1: Get upload signature
        const signatureResponse = await fetch("/api/receipts/upload-signature", {
          method: "POST",
        });

        if (!signatureResponse.ok) {
          throw new Error("Failed to get upload signature");
        }

        const signatureData = await signatureResponse.json();

        // Step 2: Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signatureData.apiKey);
        formData.append("timestamp", signatureData.timestamp.toString());
        formData.append("signature", signatureData.signature);
        formData.append("folder", signatureData.folder);

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          const errorData = await cloudinaryResponse.json().catch(() => ({}));
          const errorMessage =
            errorData.error?.message ||
            `Upload failed: ${cloudinaryResponse.status}`;
          throw new Error(errorMessage);
        }

        const cloudinaryData = await cloudinaryResponse.json();
        onUpload(cloudinaryData.secure_url, cloudinaryData.public_id);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploadError(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const fileHandler = useFileHandler(handleFileSelect);

  const handleRemove = useCallback(() => {
    if (fileHandler.previewUrl) {
      URL.revokeObjectURL(fileHandler.previewUrl);
    }
    fileHandler.reset();
    onRemove();
  }, [fileHandler, onRemove]);

  const displayImageUrl = fileHandler.previewUrl || imageUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5">
        <div className="shrink-0">
          <ImageIcon className="size-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <label className="text-small font-medium">Receipt Photo (Optional)</label>
        </div>
      </div>

      {displayImageUrl ? (
        <div className="relative border border-border rounded-lg overflow-hidden bg-muted/30">
          <Image
            src={displayImageUrl}
            alt="Receipt preview"
            width={400}
            height={300}
            className="w-full h-auto object-contain"
            unoptimized
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="size-4" />
              <span className="sr-only">Remove photo</span>
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            fileHandler.dragActive
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={fileHandler.handleDrag}
          onDragLeave={fileHandler.handleDrag}
          onDragOver={fileHandler.handleDrag}
          onDrop={fileHandler.handleDrop}
          onClick={disabled ? undefined : fileHandler.handleFileClick}
        >
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-small text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="size-8 mx-auto text-muted-foreground" />
              <p className="text-small text-muted-foreground">
                Drag and drop or click to upload
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-small text-destructive">{uploadError}</p>
      )}

      <input
        ref={fileHandler.fileInputRef}
        type="file"
        accept="image/*"
        onChange={fileHandler.handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}

