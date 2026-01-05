"use client";

import { useEffect, useCallback } from "react";
import { useReceiptUpload } from "@/hooks/use-receipt-upload";
import { useFileHandler } from "@/hooks/use-file-handler";
import { useAiUsage } from "@/hooks/use-ai-usage";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/receipt-upload/upload-dropzone";
import { UploadProgress } from "@/components/receipt-upload/upload-progress";
import { ProcessingState } from "@/components/receipt-upload/processing-state";
import { CompletedState } from "@/components/receipt-upload/completed-state";
import { ErrorState } from "@/components/receipt-upload/error-state";
import { InfoSection } from "@/components/receipt-upload/info-section";
import { ExtractionConfirmationDialog } from "@/components/receipt-upload/extraction-confirmation-dialog";
import { UsageIndicator } from "@/components/receipt-upload/usage-indicator";
import { LimitReachedState } from "@/components/receipt-upload/limit-reached-state";
import type { ReceiptExtractionResult } from "@/lib/ai/schemas";

export default function ScanReceiptPage() {
  const {
    progress,
    uploadReceipt,
    confirmExtraction,
    cancelExtraction,
    reset,
  } = useReceiptUpload();
  const {
    usage,
    isLoading: usageLoading,
    refetch: refetchUsage,
  } = useAiUsage();
  const router = useRouter();

  const fileHandler = useFileHandler(uploadReceipt);

  // Redirect on completion only if items were extracted
  useEffect(() => {
    if (
      progress.state === "completed" &&
      progress.receiptId &&
      (progress.itemCount || 0) > 0
    ) {
      // Refetch usage after successful scan
      refetchUsage();
      const timer = setTimeout(() => {
        router.push(`/dashboard/receipts/${progress.receiptId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [
    progress.state,
    progress.receiptId,
    progress.itemCount,
    router,
    refetchUsage,
  ]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (fileHandler.previewUrl) {
        URL.revokeObjectURL(fileHandler.previewUrl);
      }
    };
  }, [fileHandler.previewUrl]);

  // Reset handler
  const handleReset = useCallback(() => {
    reset();
    fileHandler.reset();
  }, [reset, fileHandler]);

  // Handle confirmation
  const handleConfirm = useCallback(
    async (modifiedData: ReceiptExtractionResult) => {
      try {
        await confirmExtraction(modifiedData);
        // Refetch usage after successful confirmation
        await refetchUsage();
      } catch (error) {
        console.error("Failed to confirm extraction:", error);
        // Error will be handled by the dialog or we can show a toast
      }
    },
    [confirmExtraction, refetchUsage]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    cancelExtraction();
    fileHandler.reset();
  }, [cancelExtraction, fileHandler]);

  const displayImageUrl = fileHandler.previewUrl || progress.imageUrl;

  // Show limit reached state if user has no remaining scans
  if (usage && usage.remaining === 0 && progress.state === "idle") {
    return (
      <div className="space-y-12">
        <div className="space-y-2">
          <h1 className="text-display">Scan Receipt</h1>
          <p className="text-body text-muted-foreground">
            Take a photo of your receipt to automatically extract items
          </p>
        </div>
        <LimitReachedState resetsAt={usage.resetsAt} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-display">Scan Receipt</h1>
            <p className="text-body text-muted-foreground">
              Take a photo of your receipt to automatically extract items
            </p>
          </div>
          {usage && (
            <UsageIndicator
              remaining={usage.remaining}
              limit={usage.limit}
              resetsAt={usage.resetsAt}
              isLoading={usageLoading}
              isPro={usage.isPro}
            />
          )}
        </div>
      </div>

      {progress.state === "idle" && (
        <UploadDropzone
          dragActive={fileHandler.dragActive}
          fileInputRef={fileHandler.fileInputRef}
          onDrag={fileHandler.handleDrag}
          onDrop={fileHandler.handleDrop}
          onInputChange={fileHandler.handleInputChange}
          onFileClick={fileHandler.handleFileClick}
        />
      )}

      {progress.state === "uploading" && displayImageUrl && (
        <UploadProgress
          imageUrl={displayImageUrl}
          progress={progress.progress}
        />
      )}

      {progress.state === "processing" && displayImageUrl && (
        <ProcessingState
          imageUrl={displayImageUrl}
          progress={progress.progress}
          extractedData={progress.extractedData}
        />
      )}

      {progress.state === "completed" && (
        <CompletedState
          imageUrl={displayImageUrl || undefined}
          itemCount={progress.itemCount || 0}
          extractedData={progress.extractedData}
          onRetry={(progress.itemCount || 0) === 0 ? handleReset : undefined}
        />
      )}

      {progress.state === "error" && (
        <ErrorState error={progress.error} onRetry={handleReset} />
      )}

      {(progress.state === "idle" || progress.state === "error") && (
        <InfoSection />
      )}

      {/* Confirmation Dialog */}
      {progress.state === "awaiting_confirmation" &&
        progress.extractedData &&
        progress.receiptId && (
          <ExtractionConfirmationDialog
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                handleCancel();
              }
            }}
            receiptId={progress.receiptId}
            imageUrl={progress.imageUrl}
            extractedData={progress.extractedData as ReceiptExtractionResult}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
    </div>
  );
}
