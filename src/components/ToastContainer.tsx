import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-xl border text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-3 duration-200 ${
            n.type === 'error'
              ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
              : n.type === 'info'
              ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]'
              : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {n.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
            ) : n.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0 text-[#2563EB]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
            )}
            <span className="truncate">{n.message}</span>
          </div>
          <button
            onClick={() => dismissNotification(n.id)}
            className="p-1 hover:opacity-75 rounded transition-opacity shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
