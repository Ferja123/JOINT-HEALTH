import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MessageCircle } from 'lucide-react';

// Components
import { UrgencyBanner } from './components/UrgencyBanner';
import { HeroSection } from './components/HeroSection';
import { SolutionSection } from './components/SolutionSection';
import { BenefitsGrid } from './components/BenefitsGrid';
import { IngredientsSection } from './components/IngredientsSection';
import { ScienceSection } from './components/ScienceSection';
import { OrderForm } from './components/OrderForm';

export default function App() {
  const [stock, setStock] = useState(14);
  const [timeLeft, setTimeLeft] = useState(23 * 60 + 54);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // Timers and Stock simulation (Urgency)
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    const stockTimer = setInterval(() => {
      setStock(prev => (prev > 3 && Math.random() > 0.7 ? prev - 1 : prev));
    }, 15000);

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const orderEl = document.getElementById('ordenar');
      let orderVisible = false;
      if (orderEl) {
        const rect = orderEl.getBoundingClientRect();
        orderVisible = rect.top < window.innerHeight && rect.bottom > 0;
      }
      setShowFloatingCTA(scrollPos > 600 && !orderVisible);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      clearInterval(stockTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const scrollToOrder = () => {
    document.getElementById('ordenar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-light font-body text-slate-900 selection:bg-brand-gold/30">
      {/* Sticky Banner with Urgency Timer */}
      <UrgencyBanner timeLeft={timeLeft} formatTime={formatTime} />

      <main>
        {/* Premium Hero with Branding */}
        <HeroSection onOrderClick={scrollToOrder} />

        {/* Storytelling: Problem vs Solution */}
        <SolutionSection />

        {/* Benefits Grid */}
        <BenefitsGrid />

        {/* Science and Diagram */}
        <ScienceSection />

        {/* Nutritional Info Section */}
        <IngredientsSection />

        {/* High Conversion Order Form with Stock Urgency */}
        <OrderForm stock={stock} />
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy py-12 px-4 text-center border-t border-brand-gold/10">
        <div className="max-w-7xl mx-auto space-y-6">
           <div className="text-brand-gold font-heading font-black text-2xl uppercase tracking-tighter">FUNRICH JOINT HEALTH</div>
           <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">© 2026 Funrich Original USA. Todos los derechos reservados.</p>
           <p className="text-[10px] text-slate-600 max-w-xl mx-auto italic">
              Este producto no intenta diagnosticar, tratar, curar o prevenir ninguna enfermedad. Los resultados pueden variar de persona a persona. Consulte a su médico antes de iniciar cualquier tratamiento.
           </p>
        </div>
      </footer>

      {/* Floating Mobile CTA */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 z-[150]"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToOrder}
              className="bg-green-600/90 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-2xl shadow-green-900/30 flex items-center gap-3 border border-white/20"
            >
              <Truck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">ORDENAR AHORA</span>
              <MessageCircle className="w-5 h-5 opacity-50" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
