import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/10 text-white/90",
        accent:
          "border-transparent bg-[hsla(var(--theme-accent)/0.18)] text-[hsl(var(--theme-accent-soft))]",
        success: "border-emerald-400/20 bg-emerald-400/15 text-emerald-200",
        danger: "border-rose-400/20 bg-rose-400/15 text-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
