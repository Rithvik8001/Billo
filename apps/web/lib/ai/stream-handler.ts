import type { ReceiptExtractionResult } from "./schemas";
import {
  saveExtractedReceiptData,
  markReceiptExtractionFailed,
} from "./receipt-processor";

export interface ReceiptExtractionStreamResult {
  partialOutputStream: AsyncIterable<unknown>;
  output:
    | PromiseLike<ReceiptExtractionResult>
    | Promise<ReceiptExtractionResult>;
}

export function createReceiptExtractionStream(
  result: ReceiptExtractionStreamResult,
  receiptId: string | undefined,
  receipt: { id: string } | null
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        // Stream partial updates to client
        for await (const partialObject of result.partialOutputStream) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "partial",
                data: partialObject,
              })}\n\n`
            )
          );
        }

        // Get the final complete object (validated against schema)
        const fullObject = await result.output;

        // Emit awaiting_confirmation instead of auto-saving
        if (fullObject && receiptId && receipt) {
          // Check if items were extracted
          const itemCount = fullObject.items?.length || 0;

          if (itemCount === 0) {
            // No items extracted - mark as failed
            await markReceiptExtractionFailed(
              receiptId,
              "No items detected in receipt image"
            );

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "completed",
                  receiptId,
                  itemCount: 0,
                })}\n\n`
              )
            );
          } else {
            // Items extracted - emit awaiting_confirmation for user review
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "awaiting_confirmation",
                  receiptId,
                  itemCount,
                  data: fullObject,
                })}\n\n`
              )
            );
          }
        } else if (fullObject) {
          // No receiptId provided, just return the extracted data
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "completed",
                data: fullObject,
              })}\n\n`
            )
          );
        }

        controller.close();
      } catch (error) {
        console.error("Streaming error:", error);

        // Update receipt status to failed if we have a receiptId
        if (receiptId) {
          await markReceiptExtractionFailed(
            receiptId,
            error instanceof Error ? error.message : "Extraction failed"
          );
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            })}\n\n`
          )
        );
        controller.close();
      }
    },
  });
}
