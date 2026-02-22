//components/ui/sheet.tsx
'use client';

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentProps<typeof DialogPrimitive.Content> & { side?: "left" | "right" }
>(({ className, side = "right", children, ...props }, ref) => {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed z-50 shadow-lg p-6 w-64 h-full overflow-auto transition-transform border-l border-border",
                    "bg-white dark:bg-gray-950", 
                    side === "left" && "left-0 animate-in slide-in-from-left",
                    side === "right" && "right-0 animate-in slide-in-from-right",
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn("mb-4 flex flex-col space-y-2", className)} {...props}>
            {children}
        </div>
    );
};

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
        {...props}
    />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose };

