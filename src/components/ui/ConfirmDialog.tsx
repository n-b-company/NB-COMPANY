'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
}: ConfirmDialogProps) {
  const colors = {
    warning: {
      icon: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      button: 'bg-yellow-500 hover:bg-yellow-600',
    },
    danger: {
      icon: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      button: 'bg-red-500 hover:bg-red-600',
    },
    info: {
      icon: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      button: 'bg-blue-500 hover:bg-blue-600',
    },
  };

  const colorScheme = colors[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${colorScheme.bg} ${colorScheme.border} border`}
                >
                  <AlertCircle className={`h-5 w-5 ${colorScheme.icon}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/50 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm leading-relaxed text-zinc-400">{message}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-zinc-800 p-6">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/50 py-3 font-bold text-zinc-300 transition-all hover:bg-zinc-800 active:scale-[0.98]"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 rounded-xl py-3 font-bold text-white transition-all active:scale-[0.98] ${colorScheme.button}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
