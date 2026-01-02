"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface ManualEntryItem {
  id: string; // temp ID for UI
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

export interface ManualEntryReceiptDetails {
  merchantName: string;
  purchaseDate: string;
  tax: string;
}

export interface ManualEntryState {
  step: 1 | 2 | 3;
  receiptDetails: ManualEntryReceiptDetails;
  items: ManualEntryItem[];
}

const initialState: ManualEntryState = {
  step: 1,
  receiptDetails: {
    merchantName: "",
    purchaseDate: "",
    tax: "",
  },
  items: [],
};

export function useManualEntry() {
  const router = useRouter();
  const [state, setState] = useState<ManualEntryState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate totals
  const subtotal = useMemo(() => {
    return state.items.reduce(
      (sum, item) => sum + parseFloat(item.totalPrice || "0"),
      0
    );
  }, [state.items]);

  const taxAmount = useMemo(() => {
    return state.receiptDetails.tax
      ? parseFloat(state.receiptDetails.tax)
      : 0;
  }, [state.receiptDetails.tax]);

  const totalAmount = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  // Step navigation
  const goToStep = useCallback((step: 1 | 2 | 3) => {
    setState((prev) => ({ ...prev, step }));
    setError(null);
  }, []);

  const nextStep = useCallback(() => {
    if (state.step === 1) {
      // Step 1 -> Step 2: Validate required fields
      if (!state.receiptDetails.merchantName.trim()) {
        setError("Merchant name is required");
        return;
      }
      if (!state.receiptDetails.purchaseDate) {
        setError("Purchase date is required");
        return;
      }
      setError(null);
      goToStep(2);
    } else if (state.step === 2) {
      // Step 2 -> Step 3: Must have at least one item
      if (state.items.length === 0) {
        setError("Please add at least one item");
        return;
      }
      goToStep(3);
    }
  }, [state.step, state.items.length, state.receiptDetails, goToStep]);

  const prevStep = useCallback(() => {
    if (state.step === 2) {
      goToStep(1);
    } else if (state.step === 3) {
      goToStep(2);
    }
  }, [state.step, goToStep]);

  // Receipt details updates
  const updateReceiptDetails = useCallback(
    (updates: Partial<ManualEntryReceiptDetails>) => {
      setState((prev) => ({
        ...prev,
        receiptDetails: { ...prev.receiptDetails, ...updates },
      }));
    },
    []
  );

  // Item management
  const addItem = useCallback(() => {
    const newItem: ManualEntryItem = {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: "",
      quantity: "1",
      unitPrice: "",
      totalPrice: "0.00",
    };
    setState((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    return newItem.id;
  }, []);

  const updateItem = useCallback(
    (id: string, updates: Partial<ManualEntryItem>) => {
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) => {
          if (item.id === id) {
            const updated = { ...item, ...updates };
            // Auto-calculate totalPrice if quantity or unitPrice changed
            if (
              updates.quantity !== undefined ||
              updates.unitPrice !== undefined
            ) {
              const qty = parseFloat(updated.quantity || "1");
              const unitPrice = parseFloat(updated.unitPrice || "0");
              updated.totalPrice = (qty * unitPrice).toFixed(2);
            }
            return updated;
          }
          return item;
        }),
      }));
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  // Save receipt
  const saveReceipt = useCallback(async () => {
    // Validate required fields
    if (!state.receiptDetails.merchantName.trim()) {
      setError("Merchant name is required");
      return;
    }
    if (!state.receiptDetails.purchaseDate) {
      setError("Purchase date is required");
      return;
    }
    if (state.items.length === 0) {
      setError("Please add at least one item");
      return;
    }

    // Validate all items have required fields
    const invalidItems = state.items.filter(
      (item) => !item.name.trim() || !item.unitPrice || !item.totalPrice
    );

    if (invalidItems.length > 0) {
      setError("Please fill in all item details");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        merchantName: state.receiptDetails.merchantName.trim(),
        purchaseDate: state.receiptDetails.purchaseDate,
        tax: state.receiptDetails.tax || undefined,
        items: state.items.map((item) => ({
          name: item.name.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      };

      const response = await fetch("/api/receipts/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create receipt");
      }

      const receipt = await response.json();
      toast.success("Receipt created successfully!");
      
      // Reset state
      setState(initialState);
      
      // Redirect to receipt review page
      router.push(`/dashboard/receipts/${receipt.id}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create receipt";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [state, router]);

  // Reset
  const reset = useCallback(() => {
    setState(initialState);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    state,
    isLoading,
    error,
    subtotal,
    taxAmount,
    totalAmount,
    goToStep,
    nextStep,
    prevStep,
    updateReceiptDetails,
    addItem,
    updateItem,
    removeItem,
    saveReceipt,
    reset,
  };
}

