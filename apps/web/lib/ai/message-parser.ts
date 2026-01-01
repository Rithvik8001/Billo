export interface ParsedMessage {
  imageUrl?: string;
  receiptId?: number;
}

export function extractImageUrl(message: {
  content?: string | Array<{ type: string; image?: string }>;
}): string | undefined {
  if (!message.content) return undefined;

  // Handle array content (structured format)
  if (Array.isArray(message.content)) {
    const imageContent = message.content.find(
      (c) => c.type === "image" && c.image
    );
    return imageContent?.image;
  }

  // Handle string content (try to extract URL)
  if (typeof message.content === "string") {
    const urlMatch = message.content.match(
      /https?:\/\/[^\s]+\.(jpg|jpeg|png|webp|gif)/i
    );
    return urlMatch ? urlMatch[0] : undefined;
  }

  return undefined;
}

export function extractReceiptId(
  message: { content?: string },
  bodyReceiptId?: unknown
): number | undefined {
  // Check body first
  if (bodyReceiptId) {
    const parsed = parseInt(String(bodyReceiptId), 10);
    if (!isNaN(parsed)) return parsed;
  }

  // Try to extract from message text
  if (typeof message.content === "string") {
    const receiptIdMatch = message.content.match(/receipt[_\s]?id[:\s]+(\d+)/i);
    if (receiptIdMatch) {
      const parsed = parseInt(receiptIdMatch[1], 10);
      if (!isNaN(parsed)) return parsed;
    }
  }

  return undefined;
}

export function parseChatMessage(
  messages: Array<{
    content?: string | Array<{ type: string; image?: string }>;
  }>,
  bodyReceiptId?: unknown
): ParsedMessage {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    return {};
  }

  return {
    imageUrl: extractImageUrl(lastMessage),
    receiptId: extractReceiptId(
      lastMessage as { content?: string },
      bodyReceiptId
    ),
  };
}
