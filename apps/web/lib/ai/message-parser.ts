export interface ParsedMessage {
  imageUrl?: string;
  receiptId?: string;
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
): string | undefined {
  // Check body first - validate as UUID
  if (bodyReceiptId) {
    const idString = String(bodyReceiptId);
    // UUID regex pattern
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(idString)) {
      return idString;
    }
  }

  // Try to extract from message text (UUID format only)
  if (typeof message.content === "string") {
    const uuidMatch = message.content.match(/receipt[_\s]?id[:\s]+([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    if (uuidMatch) {
      return uuidMatch[1];
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
