import { auth } from "@clerk/nextjs/server";
import { streamText, Output } from "ai";
import { receipts } from "@/db/models/schema";
import { receiptExtractionSchema } from "@/lib/ai/schemas";
import { RECEIPT_EXTRACTION_PROMPT } from "@/lib/ai/prompts";
import { parseChatMessage } from "@/lib/ai/message-parser";
import {
  validateReceipt,
  markReceiptAsProcessing,
} from "@/lib/ai/receipt-validator";
import { createReceiptExtractionStream } from "@/lib/ai/stream-handler";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { messages, receiptId } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Parse message to extract image URL and receipt ID
    const parsed = parseChatMessage(messages, receiptId);
    let { imageUrl } = parsed;
    const extractedReceiptId = parsed.receiptId;

    // Validate receipt if ID provided
    let receipt: typeof receipts.$inferSelect | null = null;
    if (extractedReceiptId) {
      if (isNaN(extractedReceiptId)) {
        return Response.json({ error: "Invalid receipt ID" }, { status: 400 });
      }

      const validation = await validateReceipt(extractedReceiptId, userId);
      if (!validation.isValid) {
        return Response.json(
          {
            error: validation.error,
            ...(validation.receipt && { receipt: validation.receipt }),
          },
          { status: validation.error === "Receipt not found" ? 404 : 400 }
        );
      }

      receipt = validation.receipt;

      // Use receipt's image URL if available
      if (receipt.imageUrl && !imageUrl) {
        imageUrl = receipt.imageUrl;
      }

      // Update status to processing
      await markReceiptAsProcessing(extractedReceiptId);
    }

    // Validate image URL
    if (!imageUrl) {
      return Response.json(
        { error: "Image URL is required in message content" },
        { status: 400 }
      );
    }

    // Validate API key
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "AI Gateway API key not configured" },
        { status: 500 }
      );
    }

    // Stream the object extraction using streamText with Output.object()
    // See: https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data
    const result = streamText({
      model: "google/gemini-3-flash",
      output: Output.object({
        schema: receiptExtractionSchema,
      }),
      messages: [
        {
          role: "user" as const,
          content: [
            {
              type: "text" as const,
              text: RECEIPT_EXTRACTION_PROMPT,
            },
            {
              type: "image" as const,
              image: imageUrl,
            },
          ],
        },
      ],
      headers: {
        "x-vercel-ai-gateway-api-key": apiKey,
      },
    });

    // Create and return streaming response
    const stream = createReceiptExtractionStream(
      {
        partialOutputStream: result.partialOutputStream,
        output: result.output,
      },
      extractedReceiptId,
      receipt
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return Response.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
