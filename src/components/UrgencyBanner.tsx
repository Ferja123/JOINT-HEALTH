import React from 'react';
import { motion } from 'framer-motion';
import { Timer, Truck, Sparkles, AlertCircle } from 'lucide-react';

interface UrgencyBannerProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({ timeLeft, formatTime }) => {
  return (
    <div className="sticky top-0 z-[100] w-full overflow-hidden bg-brand-navy border-b border-brand-gold/20 shadow-lg">
      {/* Animated Glow Overlay */}
      <div className="absolute inset-0 bg-brand-gold/5 animate-pulse" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-2 text-center md:py-3 select-none">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          {/* Shipping Info */}
          <div className="flex items-center gap-2 group cursor-default">
            <Truck className="w-4 h-4 text-brand-gold animate-bounce" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/90">
              ENVÍO <span className="text-brand-gold">GRATIS</span> A TODO EL PERÚ
            </span>
          </div>

          {/* Separator Dot */}
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-gold/30" />

          {/* Offer Timer */}
          <div className="flex items-center gap-3 glass-navy px-3 py-1 rounded-full border border-brand-gold/10">
            <div className="relative">
              <Timer className="w-3.5 h-3.5 text-brand-gold" />
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-brand-gold/30 rounded-full blur-[2px] -z-10" 
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black tabular-nums tracking-wider text-white">
              <span className="text-[9px] uppercase tracking-tighter text-slate-400 font-bold opacity-80">La oferta termina en</span>
              <span className="text-brand-gold text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Separator Dot */}
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-gold/30" />

          {/* Payment Info */}
          <div className="flex items-center gap-2 text-white/80">
            <Sparkles className="w-3 h-3 text-brand-gold animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
              PAGA AL RECIBIR (CONTRAENTREGA)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
