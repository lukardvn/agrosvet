import { ReactNode, useEffect, useId, useRef } from 'react';
import { AlertTriangle, HelpCircle, LoaderCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Potvrdi',
  cancelLabel = 'Otkaži',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => cancelButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onCancel();
      if (event.key !== 'Tab') return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])');
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loading, onCancel, open]);

  if (!open) return null;

  const danger = variant === 'danger';
  const Icon = danger ? AlertTriangle : HelpCircle;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-[2px] sm:items-center"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl shadow-slate-950/25"
      >
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${danger ? 'bg-red-50 text-red-600' : 'bg-agro-50 text-agro-700'}`}>
            <Icon size={22} />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id={titleId} className="text-lg font-black tracking-tight text-slate-950">{title}</h2>
            {description && <div id={descriptionId} className="mt-2 text-sm leading-6 text-slate-500">{description}</div>}
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Zatvori"
            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl px-5 py-2.5 text-sm font-black text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-agro-600 hover:bg-agro-700'}`}
          >
            {loading && <LoaderCircle className="animate-spin" size={17} />}
            {loading ? 'Sačekajte...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
