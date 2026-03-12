import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
              style={{ backgroundColor: 'rgba(12, 13, 18, 0.72)', backdropFilter: 'blur(10px)' }}
              onClick={() => onOpenChange(false)}
            >
              <DialogPrimitive.Content asChild forceMount onClick={(e) => e.stopPropagation()}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative w-full max-w-5xl overflow-hidden rounded-2xl border"
                  style={{
                    backgroundColor: 'var(--_theme---base--surface--overlay)',
                    borderColor: 'var(--_theme---base--border--subtle)',
                  }}
                >
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                      style={{
                        backgroundColor: 'var(--_theme---base--surface--raised)',
                        borderColor: 'var(--_theme---base--border--subtle)',
                        color: 'var(--_theme---base--text--primary)',
                      }}
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </DialogClose>

                  <div className="aspect-video w-full bg-black">{children}</div>
                </motion.div>
              </DialogPrimitive.Content>
            </motion.div>
          </DialogPrimitive.Overlay>
        )}
      </AnimatePresence>
    </DialogPrimitive.Portal>
  );
}

