import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOrderClick: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onOrderClick }) => {
  return (
    <section className="relative pt-16 pb-24 overflow-hidden px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-gradient-to-b from-brand-navy/5 to-transparent rounded-b-[100px]" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> 
            Certificación Grado Farmacéutico
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-brand-navy leading-[1.05]">
            Recupera tu <span className="text-brand-gold">Libertad</span> de Movimiento.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 font-body max-w-xl mx-auto lg:mx-0 leading-relaxed">
            La fórmula americana #1 en regeneración articular. Sin cirugías, sin dolor crónico, solo resultados reales en 14 días.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button 
              onClick={onOrderClick}
              className="group relative px-8 py-5 bg-brand-navy text-white rounded-2xl font-bold text-lg overflow-hidden shadow-2xl shadow-brand-navy/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
              <span className="flex items-center justify-center gap-2">
                OBTENER MI TRATAMIENTO <ArrowRight className="w-5 h-5" />
              </span>
            </button>
            
            <div className="flex items-center gap-3 justify-center text-slate-500 font-medium text-sm">
              <span className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </span>
              +15k Peruanos Satisfechos
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          {/* Glass Effect Card behind bottle */}
          <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-brand-navy/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10 group">
             <motion.img 
              src="/original_bottle.png" 
              alt="Funrich Joint Health Original Bottle" 
              className="w-full max-w-[320px] md:max-w-[420px] drop-shadow-[0_35px_35px_rgba(26,54,93,0.2)] animate-float-premium"
            />
            
            {/* Trust Floating Badge */}
            <div className="absolute -bottom-4 right-0 glass px-6 py-4 rounded-3xl shadow-xl border-slate-200/50 hidden md:block">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Calidad Garantizada</p>
                    <p className="text-sm font-bold text-brand-navy">Fórmula Original USA</p>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
