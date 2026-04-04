import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Zap, ShieldCheck } from 'lucide-react';

export const ScienceSection: React.FC = () => {
  const areas = [
    { area: 'Articulación de Cuello', desc: 'Reduce rigidez cervical y mejora giros.' },
    { area: 'Hombros y Espalda', desc: 'Alivia tensión lumbar y contracturas.' },
    { area: 'Manos y Muñecas', desc: 'Mejora el agarre y fuerza fina.' },
    { area: 'Rodillas y Caderas', desc: 'Elimina el "click" doloroso al caminar.' },
    { area: 'Pies y Tobillos', desc: 'Soporta el peso diario sin ardor.' },
    { area: 'Cartílago General', desc: 'Engrosa la capa protectora ósea.' }
  ];

  return (
    <section className="py-24 px-4 bg-slate-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4"
           >
              <Microscope className="w-8 h-8" />
           </motion.div>
           <h2 className="text-4xl md:text-5xl font-heading font-black text-brand-navy">Nutrición de Grado <span className="text-brand-gold">Militar</span></h2>
           <p className="text-slate-500 font-body text-lg">
             Basado en estudios clínicos de regeneración conectiva. Nuestra fórmula penetra hasta el núcleo del hueso, nutriendo el cartílago donde otros suplementos no llegan.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative pt-12"
           >
              <div className="absolute inset-0 bg-brand-navy/10 blur-[120px] rounded-full" />
              <img src="/cartilage_science_diagram.png" alt="Ciencia del Cartílago Anatomía" className="relative z-10 w-full rounded-[3rem] shadow-2xl border-2 border-brand-gold/10" />
              
              <div className="absolute -top-6 -right-6 lg:-right-12 glass shadow-2xl p-6 rounded-[2rem] max-w-[200px] border-white/50 backdrop-blur-xl">
                 <div className="w-10 h-10 bg-brand-gold rounded-xl mb-3 flex items-center justify-center text-white font-bold">
                    <Zap className="w-6 h-6" />
                 </div>
                 <h4 className="text-brand-navy font-bold text-sm mb-1">Efecto Amortiguador</h4>
                 <p className="text-[10px] text-slate-500 font-medium">Restaura el líquido sinovial para evitar el roce óseo.</p>
              </div>
           </motion.div>

           <div className="grid grid-cols-2 gap-4">
              {areas.map((item, i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-6 bg-white rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-xl transition-premium group hover:border-brand-gold/30"
                >
                   <div className="w-10 h-10 bg-slate-50 text-brand-gold rounded-xl mb-4 flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-premium">
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                   <h4 className="font-heading font-extrabold text-brand-navy text-xs mb-1 uppercase tracking-wider">{item.area}</h4>
                   <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};
