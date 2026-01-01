import Image from "next/image";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletedStateProps {
  imageUrl?: string;
  itemCount: number;
  extractedData?: { items?: unknown[] };
  onRetry?: () => void;
}

export function CompletedState({
  imageUrl,
  itemCount,
  extractedData,
  onRetry,
}: CompletedStateProps) {
  const hasItems = itemCount > 0 || (extractedData?.items && extractedData.items.length > 0);
  const actualItemCount = itemCount || extractedData?.items?.length || 0;

  return (
    <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        {hasItems ? (
          <>
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <CheckCircle2 className="size-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Receipt Processed!</h3>
            <p className="text-muted-foreground mb-6">
              Successfully extracted {actualItemCount} {actualItemCount === 1 ? "item" : "items"}
            </p>
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Receipt"
                width={512}
                height={512}
                className="w-full max-w-md h-auto rounded-lg object-contain border mb-6"
                unoptimized
              />
            )}
            <p className="text-sm text-muted-foreground">
              Redirecting to receipt review...
            </p>
          </>
        ) : (
          <>
            <div className="bg-yellow-500/10 rounded-full p-6 mb-4">
              <AlertCircle className="size-12 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Receipt Detected</h3>
            <p className="text-muted-foreground mb-2">
              Image uploaded successfully, but no items were detected.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              This might not be a receipt, or the image quality is too low. Please try uploading a clear receipt image.
            </p>
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Uploaded image"
                width={512}
                height={512}
                className="w-full max-w-md h-auto rounded-lg object-contain border mb-6"
                unoptimized
              />
            )}
            {onRetry && (
              <Button
                onClick={onRetry}
                className="rounded-2xl"
              >
                Try Another Image
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

