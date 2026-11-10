import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectToast, hideToast } from '@/store/slices/uiSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function GlobalToast() {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

  useEffect(() => {
    if (!toast.isVisible) return;
    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.isVisible, dispatch]);

  if (!toast.isVisible) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-gold-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-950/80',
    error: 'border-red-500/30 bg-red-950/80',
    warning: 'border-amber-500/30 bg-amber-950/80',
    info: 'border-gold-400/30 bg-ink-950/85',
  };

  return (
    <aside
      aria-label="Notification alerts"
      className="fixed bottom-6 right-6 z-[200] max-w-sm w-full animate-fade-in"
    >
      <div
        className={`flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl text-xs text-ink-100 ${
          borderColors[toast.type] || borderColors.info
        }`}
      >
        <div className="flex items-center gap-2.5">
          {icons[toast.type] || icons.info}
          <span className="leading-snug">{toast.message}</span>
        </div>
        <button
          onClick={() => dispatch(hideToast())}
          className="text-ink-400 hover:text-white transition-colors cursor-pointer p-1"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}

