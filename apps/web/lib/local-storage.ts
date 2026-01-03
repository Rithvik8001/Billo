const STORAGE_KEY_PREFIX = "billo_pending_receipt_";

export interface PendingReceipt {
  id: string;
  file: File;
  timestamp: number;
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  receiptId?: string;
  imageUrl?: string;
  error?: string;
}

/**
 * Store a pending receipt in localStorage
 */
export function setPendingReceipt(
  id: string,
  data: Omit<PendingReceipt, "file">
): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save pending receipt to localStorage:", error);
  }
}

/**
 * Get a pending receipt from localStorage
 */
export function getPendingReceipt(
  id: string
): Omit<PendingReceipt, "file"> | null {
  if (typeof window === "undefined") return null;

  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as Omit<PendingReceipt, "file">;
  } catch (error) {
    console.error("Failed to get pending receipt from localStorage:", error);
    return null;
  }
}

/**
 * Remove a pending receipt from localStorage
 */
export function removePendingReceipt(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove pending receipt from localStorage:", error);
  }
}

/**
 * Get all pending receipts from localStorage
 */
export function getAllPendingReceipts(): Omit<PendingReceipt, "file">[] {
  if (typeof window === "undefined") return [];

  try {
    const receipts: Omit<PendingReceipt, "file">[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          receipts.push(JSON.parse(item) as Omit<PendingReceipt, "file">);
        }
      }
    }
    return receipts;
  } catch (error) {
    console.error(
      "Failed to get all pending receipts from localStorage:",
      error
    );
    return [];
  }
}

/**
 * Clear all pending receipts from localStorage
 */
export function clearPendingReceipts(): void {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Failed to clear pending receipts from localStorage:", error);
  }
}
