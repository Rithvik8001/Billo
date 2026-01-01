import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="bg-destructive/10 rounded-full p-6 mb-4">
          <AlertCircle className="size-12 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Upload Failed</h3>
        <p className="text-muted-foreground mb-6">
          {error || "An error occurred while processing your receipt"}
        </p>
        <div className="flex gap-4">
          <Button onClick={onRetry} variant="outline" className="rounded-2xl">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

