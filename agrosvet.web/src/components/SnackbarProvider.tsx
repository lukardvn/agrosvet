import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

type SnackbarVariant = 'success' | 'error' | 'info';

interface SnackbarOptions {
  title?: string;
  duration?: number;
}

interface SnackbarMessage extends SnackbarOptions {
  id: string;
  message: string;
  variant: SnackbarVariant;
}

interface SnackbarContextValue {
  success: (message: string, options?: SnackbarOptions) => void;
  error: (message: string, options?: SnackbarOptions) => void;
  info: (message: string, options?: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const variantStyles = {
  success: {
    icon: CheckCircle2,
    iconClass: 'bg-agro-100 text-agro-800',
    borderClass: 'border-agro-200',
    defaultTitle: 'Uspešno',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'bg-red-50 text-red-700',
    borderClass: 'border-red-200',
    defaultTitle: 'Došlo je do greške',
  },
  info: {
    icon: Info,
    iconClass: 'bg-slate-100 text-slate-700',
    borderClass: 'border-slate-200',
    defaultTitle: 'Obaveštenje',
  },
};

const SnackbarItem = ({ snackbar, onDismiss }: { snackbar: SnackbarMessage; onDismiss: (id: string) => void }) => {
  const style = variantStyles[snackbar.variant];
  const Icon = style.icon;
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (exiting) return;
    const timeout = window.setTimeout(() => setExiting(true), snackbar.duration ?? 4500);
    return () => window.clearTimeout(timeout);
  }, [exiting, snackbar.duration]);

  useEffect(() => {
    if (!exiting) return;
    const fallback = window.setTimeout(() => onDismiss(snackbar.id), 250);
    return () => window.clearTimeout(fallback);
  }, [exiting, onDismiss, snackbar.id]);

  return (
    <div
      role={snackbar.variant === 'error' ? 'alert' : 'status'}
      onAnimationEnd={() => exiting && onDismiss(snackbar.id)}
      className={`${exiting ? 'snackbar-exit' : 'snackbar-enter'} pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-white p-4 shadow-xl shadow-agro-950/10 ${style.borderClass}`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.iconClass}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium text-agro-950">{snackbar.title ?? style.defaultTitle}</p>
        <p className="mt-1 text-sm leading-5 text-slate-500">{snackbar.message}</p>
      </div>
      <button
        onClick={() => setExiting(true)}
        disabled={exiting}
        aria-label="Zatvori obaveštenje"
        className="rounded p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:pointer-events-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setSnackbars(current => current.filter(snackbar => snackbar.id !== id));
  }, []);

  const show = useCallback((variant: SnackbarVariant, message: string, options?: SnackbarOptions) => {
    const snackbar: SnackbarMessage = {
      id: crypto.randomUUID(),
      message,
      variant,
      ...options,
    };
    setSnackbars(current => [...current.slice(-2), snackbar]);
  }, []);

  return (
    <SnackbarContext.Provider value={{
      success: (message, options) => show('success', message, options),
      error: (message, options) => show('error', message, options),
      info: (message, options) => show('info', message, options),
    }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] ml-auto flex max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6 sm:left-auto sm:w-full">
        {snackbars.map(snackbar => <SnackbarItem key={snackbar.id} snackbar={snackbar} onDismiss={dismiss} />)}
      </div>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('useSnackbar must be used within SnackbarProvider.');
  return context;
};
