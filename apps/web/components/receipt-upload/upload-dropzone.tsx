"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadDropzoneProps {
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileClick: () => void;
}

export function UploadDropzone({
  dragActive,
  fileInputRef,
  onDrag,
  onDrop,
  onInputChange,
  onFileClick,
}: UploadDropzoneProps) {
  return (
    <div
      className={`bg-white border-2 border-dashed rounded-2xl p-12 md:p-16 flex flex-col items-center justify-center text-center shadow-sm transition-colors ${
        dragActive ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <div className="bg-primary/10 rounded-full p-6 mb-4">
        <Upload className="size-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Upload Your Receipt</h3>
      <p className="text-foreground/60 max-w-md mb-6">
        Drag and drop your receipt image here, or click the button below
      </p>
      <Button
        onClick={onFileClick}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 h-auto text-base rounded-2xl px-8"
      >
        <Upload className="size-5 mr-2" />
        Choose File
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        className="hidden"
      />
    </div>
  );
}

