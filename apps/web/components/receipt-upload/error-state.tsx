import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-background border rounded-xl p-6 md:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="bg-muted rounded-full p-6 mb-4">
          <AlertCircle className="size-12 text-muted-foreground" />
        </div>
        <h3 className="text-h3 mb-2">Upload Failed</h3>
        <p className="text-body text-muted-foreground mb-6">
          {error || "An error occurred while processing your receipt"}
        </p>
        <div className="flex gap-4">
          <Button onClick={onRetry} variant="ghost">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

