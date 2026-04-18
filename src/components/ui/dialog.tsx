import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-4 bottom-4 z-50 rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 text-white shadow-2xl sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-5 top-5 rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("font-display text-xl font-semibold", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-white/65", className)} {...props} />;
}
