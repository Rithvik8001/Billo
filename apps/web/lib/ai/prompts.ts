/**
 * AI prompts for receipt extraction
 */

export const RECEIPT_EXTRACTION_PROMPT = `Analyze this receipt image and extract all relevant information. Extract:
1. Merchant/store name and address (if visible)
2. Purchase date (if visible)
3. All line items with:
   - Item name
   - Quantity
   - Unit price
   - Total price for that line
   - Line number (order on receipt)
   - Category (if identifiable: food, beverage, tax, tip, etc.)
4. Subtotal, tax amount, and total amount

Be precise with numbers and extract all items even if some details are unclear. Return quantities and prices as decimal strings (e.g., "1.5", "12.99").`;

