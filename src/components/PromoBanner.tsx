import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, X } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const { settings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings.promo_banner_active || !settings.promo_banner_text) {
    return null;
  }

  return (
    <div className="bg-[#2B1810] text-[#FEF3C7] text-xs font-medium py-2 px-4 border-b border-[#451A03] flex items-center justify-between">
      <div className="flex-1 flex items-center justify-center gap-2 text-center truncate">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
        <span className="truncate">{settings.promo_banner_text}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-[#FEF3C7]/70 hover:text-[#FEF3C7] ml-2 p-0.5 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
