"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useManualEntry } from "@/hooks/use-manual-entry";
import { StepReceiptDetails } from "./step-receipt-details";
import { StepAddItems } from "./step-add-items";
import { StepReview } from "./step-review";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { fadeInUpFast, springConfigFast } from "@/lib/motion";

export function ManualEntryWizard() {
  const {
    state,
    isLoading,
    error,
    subtotal,
    taxAmount,
    totalAmount,
    nextStep,
    prevStep,
    updateReceiptDetails,
    addItem,
    updateItem,
    removeItem,
    uploadPhoto,
    removePhoto,
    saveReceipt,
  } = useManualEntry();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <StepReceiptDetails
            receiptDetails={state.receiptDetails}
            updateReceiptDetails={updateReceiptDetails}
            imageUrl={state.imageUrl}
            imagePublicId={state.imagePublicId}
            uploadPhoto={uploadPhoto}
            removePhoto={removePhoto}
          />
        );
      case 2:
        return (
          <StepAddItems
            items={state.items}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
            subtotal={subtotal}
          />
        );
      case 3:
        return (
          <StepReview
            receiptDetails={state.receiptDetails}
            items={state.items}
            totalAmount={totalAmount}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (state.step === 1) {
      return (
        state.receiptDetails.merchantName.trim().length > 0 &&
        state.receiptDetails.purchaseDate.length > 0
      );
    }
    if (state.step === 2) {
      return state.items.length > 0;
    }
    return true;
  };

  return (
    <div className="flex gap-12 min-h-[600px]">
      {/* Vertical Step Indicator */}
      <div className="hidden lg:flex flex-col gap-8 w-48 shrink-0 pt-2">
        {[
          { num: 1, label: "Receipt Details", desc: "Basic information" },
          { num: 2, label: "Items", desc: "Add receipt items" },
          { num: 3, label: "Review", desc: "Confirm & save" },
        ].map((step, index) => {
          const isActive = state.step === step.num;
          const isCompleted = state.step > step.num;
          
          return (
            <div key={step.num} className="flex gap-4">
              {/* Step Number & Line */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : isCompleted
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={springConfigFast}
                >
                  {isCompleted ? (
                    <motion.svg
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  ) : (
                    step.num
                  )}
                </motion.div>
                {index < 2 && (
                  <motion.div
                    className={`w-0.5 flex-1 mt-2 ${
                      isCompleted ? "bg-foreground" : "bg-border"
                    }`}
                    initial={{ scaleY: isCompleted ? 1 : 0 }}
                    animate={{ scaleY: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              
              {/* Step Info */}
              <div className="flex-1 pt-1">
                <p
                  className={`text-sm font-medium mb-0.5 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        {/* Mobile Progress Indicator */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      state.step === step
                        ? "bg-foreground text-background"
                        : state.step > step
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {state.step > step ? "✓" : step}
                  </div>
                </div>
                {step < 3 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      state.step > step ? "bg-foreground" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="text-body text-destructive">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={state.step === 1 || isLoading}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          <div className="flex gap-3">
            {state.step === 3 ? (
              <Button onClick={saveReceipt} disabled={isLoading || !canProceed()}>
                {isLoading ? "Saving..." : "Save Receipt"}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed() || isLoading}
                className="gap-2"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

