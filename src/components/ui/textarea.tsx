import * as React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
