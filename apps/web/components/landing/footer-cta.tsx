import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-4 md:px-6 border-t border-border/60">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/web-logo.png"
              alt="Billo"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-body font-medium text-foreground">
              Billo
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-small text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <p className="text-small text-muted-foreground">
              © {new Date().getFullYear()} Billo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

