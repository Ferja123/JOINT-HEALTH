import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FlaskConical, ShieldCheck, Microscope } from 'lucide-react';

export const IngredientsSection: React.FC = () => {
  const ingredients = [
    { name: 'Glucosamina', dose: '1500mg', desc: 'Sustancia natural que ayuda a formar y reparar el cartílago.', icon: <CheckCircle2 className="w-5 h-5 text-brand-gold" /> },
    { name: 'Condroitina', dose: '150mg', desc: 'Proporciona resistencia a los tejidos y retiene agua en el cartílago.', icon: <FlaskConical className="w-5 h-5 text-brand-gold" /> },
    { name: 'Boswellia', dose: '200mg', desc: 'Resina natural con potentes propiedades antiinflamatorias.', icon: <Microscope className="w-5 h-5 text-brand-gold" /> },
    { name: 'Cúrcuma', dose: '150mg', desc: 'Antioxidante natural que reduce drásticamente el dolor.', icon: <ShieldCheck className="w-5 h-5 text-brand-gold" /> },
    { name: 'MSM', dose: '25mg', desc: 'Azufre orgánico que mejora la flexibilidad del tejido conectivo.', icon: <CheckCircle2 className="w-5 h-5 text-brand-gold" /> },
  ];

  return (
    <section className="py-24 px-4 bg-brand-navy text-white overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 text-brand-gold font-bold text-[10px] uppercase tracking-widest bg-brand-gold/5"
           >
             <FlaskConical className="w-3 h-3" /> Ciencia Aplicada a la Salud
           </motion.div>
           <h2 className="text-4xl md:text-5xl font-heading font-black">Fórmula <span className="text-brand-gold">Concentrada</span> de Alta Pureza.</h2>
           <p className="text-slate-400 font-body text-lg">
             No escatimamos en calidad. Cada cápsula contiene la dosis exacta estudiada por la ciencia para la regeneración ósea y articular.
           </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
           {ingredients.map((ing, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="glass-navy p-8 rounded-[2rem] text-center space-y-4 hover:border-brand-gold/40 transition-premium group"
             >
               <div className="text-brand-gold font-black text-3xl mb-1 group-hover:scale-110 transition-transform">{ing.dose}</div>
               <div className="font-heading font-bold uppercase tracking-widest text-[10px] text-slate-400">{ing.name}</div>
               <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-3">"{ing.desc}"</p>
               <div className="pt-2 flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                  {ing.icon}
               </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-24 grid lg:grid-cols-2 gap-16 items-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative rounded-[2.5rem] overflow-hidden border border-brand-gold/20 shadow-2xl"
           >
              <img src="/funrich_ingredients_info.png" alt="Información Nutricional FUNRICH Original" className="w-full opacity-90" />
           </motion.div>
           
           <div className="space-y-8">
              <h3 className="text-3xl font-heading font-bold text-white">¿Por qué es superior?</h3>
              <p className="text-slate-400 leading-relaxed">
                A diferencia de los productos económicos de farmacia, Funrich Joint Health utiliza una técnica de micro-extracción que preserva la integridad celular de sus componentes.
              </p>
              
              <div className="space-y-4">
                 {[
                   'Sinergia perfecta: El MSM potencia la absorción de la Glucosamina.',
                   'Sin rellenos innecesarios ni conservantes artificiales.',
                   'Certificado por laboratorios independientes en USA.'
                 ].map((point, i) => (
                   <div key={i} className="flex gap-4 items-start">
                     <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                     <p className="text-sm font-medium text-slate-300">{point}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};
