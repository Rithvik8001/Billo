import { FileText } from "lucide-react";

export default function ManualEntryPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Manual Entry
        </h1>
        <p className="text-lg text-muted-foreground/70">
          Enter bill details manually when you don't have a receipt to scan
        </p>
      </div>

      <div className="bg-white border-2 border-dashed rounded-2xl p-12 md:p-16 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="bg-primary/10 rounded-full p-6 mb-4">
          <FileText className="size-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Manual Entry Coming Soon
        </h3>
        <p className="text-foreground/60 max-w-md">
          We're building a simple form to manually add items and split bills
          without scanning a receipt.
        </p>
      </div>

      <div className="mt-8 bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">How it will work:</h3>
        <ol className="space-y-3 text-sm text-foreground/80">
          <li className="flex gap-3">
            <span className="font-semibold text-primary">1.</span>
            <span>Enter bill details like restaurant name and date</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">2.</span>
            <span>Add items manually with names and prices</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">3.</span>
            <span>Assign people to your bill and split items</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">4.</span>
            <span>Calculate who owes what automatically</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
