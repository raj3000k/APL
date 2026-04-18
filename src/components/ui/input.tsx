import * as React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
