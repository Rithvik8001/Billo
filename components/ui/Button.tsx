import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text" | "default";
  size?: "sm" | "md" | "lg" | "default";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2997ff] disabled:opacity-50",
          {
            // Apple-style primary button
            "bg-[#2997ff] text-white hover:bg-[#0077ed]": variant === "primary",
            // Secondary button with border
            "border border-[#424245] text-white hover:border-[#86868b]":
              variant === "secondary",
            // Text button
            "text-[#2997ff] hover:text-[#0077ed]": variant === "text",
            // Sizes
            "text-sm px-4 py-1": size === "sm",
            "text-sm px-7 py-2": size === "md",
            "text-base px-8 py-3": size === "lg",
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
