"use client";

import { useState, useCallback } from "react";
import type { ReceiptExtractionResult } from "@/lib/ai/schemas";

export type UploadState =
  | "idle"
  | "uploading"
  | "processing"
  | "awaiting_confirmation"
  | "completed"
  | "error";

export interface UploadProgress {
  state: UploadState;
  progress: number; // 0-100
  imageUrl?: string;
  receiptId?: number;
  extractedData?: Partial<ReceiptExtractionResult>;
  itemCount?: number;
  error?: string;
}

export interface UseReceiptUploadReturn {
  progress: UploadProgress;
  uploadReceipt: (file: File) => Promise<void>;
  confirmExtraction: (modifiedData: ReceiptExtractionResult) => Promise<void>;
  cancelExtraction: () => void;
  reset: () => void;
}

export function useReceiptUpload(): UseReceiptUploadReturn {
  const [progress, setProgress] = useState<UploadProgress>({
    state: "idle",
    progress: 0,
  });

  const confirmExtraction = useCallback(
    async (modifiedData: ReceiptExtractionResult) => {
      if (!progress.receiptId) {
        throw new Error("No receipt ID available");
      }

      const response = await fetch(`/api/receipts/${progress.receiptId}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extractedData: modifiedData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `Failed to confirm extraction: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setProgress((prev) => ({
        ...prev,
        state: "completed",
        itemCount: result.itemCount || prev.itemCount || 0,
      }));
    },
    [progress.receiptId]
  );

  const cancelExtraction = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      state: "idle",
      progress: 0,
      extractedData: undefined,
      itemCount: undefined,
    }));
  }, []);

  const reset = useCallback(() => {
    setProgress({
      state: "idle",
      progress: 0,
    });
  }, []);

  const uploadReceipt = useCallback(async (file: File) => {
    try {
      // Step 1: Get upload signature
      setProgress({ state: "uploading", progress: 10 });
      const signatureResponse = await fetch("/api/receipts/upload-signature", {
        method: "POST",
      });

      if (!signatureResponse.ok) {
        throw new Error("Failed to get upload signature");
      }

      const signatureData = await signatureResponse.json();

      // Step 2: Upload to Cloudinary
      setProgress({ state: "uploading", progress: 30 });
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
          `Cloudinary upload failed: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`;
        throw new Error(errorMessage);
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;
      const imagePublicId = cloudinaryData.public_id;
      const thumbnailUrl = cloudinaryData.secure_url; // Can be optimized later

      // Step 3: Create receipt record
      setProgress({ state: "uploading", progress: 60 });
      const receiptResponse = await fetch("/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          imagePublicId,
          thumbnailUrl,
        }),
      });

      if (!receiptResponse.ok) {
        const errorData = await receiptResponse.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `Failed to create receipt: ${receiptResponse.status} ${receiptResponse.statusText}`;
        throw new Error(errorMessage);
      }

      const receipt = await receiptResponse.json();
      const receiptId = receipt.id;

      // Step 4: Stream AI extraction
      setProgress({
        state: "processing",
        progress: 70,
        imageUrl,
        receiptId,
      });

      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  image: imageUrl,
                },
              ],
            },
          ],
          receiptId,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error("Failed to start AI extraction");
      }

      // Parse SSE stream
      const reader = chatResponse.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get response stream");
      }

      let buffer = "";
      let latestPartialData: Partial<ReceiptExtractionResult> | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "partial") {
                latestPartialData = data.data;
                setProgress((prev) => ({
                  ...prev,
                  state: "processing",
                  progress: 80,
                  extractedData: data.data,
                }));
              } else if (data.type === "awaiting_confirmation") {
                // Extraction complete, waiting for user confirmation
                setProgress((prev) => ({
                  ...prev,
                  state: "awaiting_confirmation",
                  progress: 100,
                  itemCount: data.itemCount || prev.extractedData?.items?.length || 0,
                  extractedData: data.data || latestPartialData || prev.extractedData,
                }));
              } else if (data.type === "completed") {
                // Use the latest partial data or the completed data
                const finalData = data.data || latestPartialData;
                setProgress((prev) => ({
                  ...prev,
                  state: "completed",
                  progress: 100,
                  itemCount: data.itemCount || prev.extractedData?.items?.length || 0,
                  extractedData: finalData || prev.extractedData,
                }));
              } else if (data.type === "error") {
                throw new Error(data.error || "Extraction failed");
              }
            } catch (parseError) {
              console.error("Failed to parse SSE data:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setProgress((prev) => ({
        ...prev,
        state: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      }));
    }
  }, []);

  return {
    progress,
    uploadReceipt,
    confirmExtraction,
    cancelExtraction,
    reset,
  };
}

