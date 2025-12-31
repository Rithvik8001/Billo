import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
      <h1 className="text-5xl md:text-6xl font-bold text-foreground text-center mb-6 tracking-tight leading-tight">
        Scan. Tap. Split.
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground/70 text-center max-w-2xl mb-12 px-4">
        Snap the receipt, tap your items, see who owes what.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 h-auto text-base rounded-2xl">
          <Camera className="w-5 h-5 mr-2" />
          Scan Receipt
        </Button>
        <Button
          variant="outline"
          className="w-full bg-background hover:bg-muted text-foreground font-semibold py-5 h-auto text-base rounded-2xl"
        >
          Enter Manually
        </Button>
      </div>
    </div>
  );
}
