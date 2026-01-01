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
  receiptId: number | undefined,
  receipt: { id: number } | null
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

        // Save to database if receiptId was provided
        if (fullObject && receiptId && receipt) {
          try {
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
              // Items extracted - save normally
              const result = await saveExtractedReceiptData(
                receiptId,
                fullObject
              );

              // Send completion message
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "completed",
                    receiptId,
                    itemCount: result.itemCount,
                  })}\n\n`
                )
              );
            }
          } catch (dbError) {
            console.error("Database save error:", dbError);
            await markReceiptExtractionFailed(
              receiptId,
              dbError instanceof Error
                ? dbError.message
                : "Database save failed"
            );

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "error",
                  error: "Failed to save to database",
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
