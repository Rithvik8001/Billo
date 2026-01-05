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
      className={`bg-background border-2 border-dashed rounded-xl p-12 md:p-16 flex flex-col items-center justify-center text-center transition-colors ${
        dragActive ? "border-accent bg-accent/5" : "border-border"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <div className="bg-muted rounded-full p-6 mb-4">
        <Upload className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-h3 mb-2">Upload Your Receipt</h3>
      <p className="text-body text-muted-foreground max-w-md mb-6">
        Drag and drop your receipt image here, or click the button below
      </p>
      <Button onClick={onFileClick}>
        <Upload className="size-4 mr-2" />
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

