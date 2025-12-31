import { Camera } from "lucide-react";

export default function ScanReceiptPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Scan Receipt
        </h1>
        <p className="text-lg text-muted-foreground/70">
          Take a photo of your receipt to automatically extract items
        </p>
      </div>

      <div className="bg-white border-2 border-dashed rounded-2xl p-12 md:p-16 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="bg-primary/10 rounded-full p-6 mb-4">
          <Camera className="size-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Receipt Scanning Coming Soon
        </h3>
        <p className="text-foreground/60 max-w-md">
          We're working on AI-powered receipt scanning. Soon you'll be able to
          snap a photo and instantly extract all items.
        </p>
      </div>

      <div className="mt-8 bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">How it will work:</h3>
        <ol className="space-y-3 text-sm text-foreground/80">
          <li className="flex gap-3">
            <span className="font-semibold text-primary">1.</span>
            <span>Take a photo of your receipt using your camera</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">2.</span>
            <span>AI automatically extracts items and prices</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">3.</span>
            <span>Tap items to assign them to people in your group</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">4.</span>
            <span>Instantly see who owes what</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
