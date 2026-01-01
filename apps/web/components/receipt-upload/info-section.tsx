export function InfoSection() {
  return (
    <div className="mt-8 bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">How it works:</h3>
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
  );
}

