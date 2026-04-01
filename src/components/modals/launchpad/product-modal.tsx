import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const ProductModal: React.FC<ModalProps> = ({
  visible,
  setVisible,
  children,
}) => {
  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogContent
        className={[
          // Surface — matches every other dialog/sheet in the system
          "w-[95vw] sm:max-w-4xl h-[90vh]",
          "bg-[#0d0d0f] border border-zinc-800/60 rounded-2xl",
          "shadow-2xl shadow-black/60",
          "p-0 gap-0 overflow-hidden",
          // Hide the default shadcn close button — we render our own
          "[&>button]:hidden",
        ].join(" ")}
      >
        {/* Top violet accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent pointer-events-none" />

        {/* Close button — matches h-7 w-7 ghost icon pattern from UserAccountNav / Sheet */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className={[
            "absolute right-4 top-4 z-20",
            "flex items-center justify-center h-7 w-7 rounded-lg",
            "border border-zinc-800 bg-zinc-900/80",
            "text-zinc-600 hover:text-zinc-200 hover:border-zinc-700",
            "transition-all duration-200",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/50",
          ].join(" ")}
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-8">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
