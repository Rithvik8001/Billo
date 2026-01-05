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
    <div className="space-y-8">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    className={`size-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      state.step === step
                        ? "bg-primary text-primary-foreground"
                        : state.step > step
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                    animate={{
                      scale: state.step === step ? 1.1 : 1,
                    }}
                    transition={springConfigFast}
                  >
                    {step}
                  </motion.div>
                  <p
                    className={`text-small mt-2 ${
                      state.step === step
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step === 1
                      ? "Details"
                      : step === 2
                      ? "Items"
                      : "Review"}
                  </p>
                </div>
                {step < 3 && (
                  <motion.div
                    className={`h-0.5 flex-1 mx-2 ${
                      state.step > step ? "bg-primary" : "bg-muted"
                    }`}
                    initial={{ scaleX: state.step > step ? 1 : 0 }}
                    animate={{ scaleX: state.step > step ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" as const }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4">
            <p className="text-body text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={state.step === 1 || isLoading}
        >
          <ChevronLeft className="size-4 mr-2" />
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
            >
              Next
              <ChevronRight className="size-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

