import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { ReceiptExtractionResult } from "@/lib/ai/schemas";
import { ExtractedItemsList } from "./extracted-items-list";

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
          <div className="shrink-0">
            <Image
              src={imageUrl}
              alt="Receipt"
              width={256}
              height={256}
              className="w-full md:w-64 h-auto rounded-lg object-contain border"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="size-5 text-primary animate-spin" />
              <h3 className="text-xl font-semibold">Analyzing receipt...</h3>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              AI is extracting items and prices
            </p>
          </div>
        </div>
      </div>

      {extractedData?.items && (
        <ExtractedItemsList items={extractedData.items} />
      )}
    </div>
  );
}

