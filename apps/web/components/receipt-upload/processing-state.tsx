import { Sparkles } from "lucide-react";
import type { ReceiptExtractionResult } from "@/lib/ai/schemas";
import { ExtractedItemsList } from "./extracted-items-list";
import { ScanningAnimation } from "./scanning-animation";

interface ProcessingStateProps {
  imageUrl: string;
  progress: number;
  extractedData?: Partial<ReceiptExtractionResult>;
}

export function ProcessingState({
  imageUrl,
  progress,
  extractedData,
}: ProcessingStateProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <ScanningAnimation imageUrl={imageUrl} />
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="size-6 text-primary animate-pulse" />
              <h3 className="text-xl font-semibold">
                Analyzing receipt with AI ✨
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="inline-block size-2 bg-primary rounded-full animate-pulse" />
                Extracting items and prices
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="inline-block size-2 bg-primary/60 rounded-full animate-pulse delay-150" />
                Detecting merchant information
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="inline-block size-2 bg-primary/40 rounded-full animate-pulse delay-300" />
                Calculating totals
              </p>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              {progress}% complete
            </div>
          </div>
        </div>
      </div>

      {extractedData?.items && (
        <ExtractedItemsList items={extractedData.items} />
      )}
    </div>
  );
}

