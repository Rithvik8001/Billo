import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GitHub } from "@/components/github";
import Link from "next/link";

export default function Nav() {
  return (
    <>
      <nav className="border-b h-16 flex items-center justify-between px-4">
        <div className="flex items-center h-full">
          <Image
            src="/web-logo.png"
            alt="Billo"
            width={50}
            height={50}
            className="object-contain self-center mt-3"
          />
        </div>
        <div className="flex items-center h-full gap-2">
          <Button>
            <GitHub className="size-4" />
            <Link href="https://github.com/Rithvik8001/Billo" target="_blank">
              <span>Star on GitHub</span>
            </Link>
          </Button>
        </div>
      </nav>
    </>
  );
}
