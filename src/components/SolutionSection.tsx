import React from 'react';
import { motion } from 'framer-motion';

export const SolutionSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* Sub-section: The Problem */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-red-100 rounded-[3rem] blur-2xl opacity-40 -z-10" />
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img src="/knee_pain_problem.png" alt="Dolor de rodilla crónico" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/40 to-transparent" />
              <div className="absolute top-8 left-8 bg-brand-accent text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                Realidad Actual
              </div>
            </div>
            
            {/* Context Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-red-50 max-w-[240px] text-center"
            >
              <p className="text-brand-accent font-black text-3xl mb-1">87%</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Aumento del dolor articular al despertar</p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy leading-tight">
              ¿Tu cuerpo se siente como una <span className="text-red-600">prisión</span> de dolor?
            </h2>
            <p className="text-lg text-slate-600 font-body leading-relaxed">
              El desgaste no solo ocurre en tus rodillas; ocurre en tu vida. Dejar de caminar, de viajar con la familia o de simplemente subir escaleras es el costo de un cartílago debilitado.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="p-5 bg-red-50 rounded-2xl border border-red-100/50 flex items-start gap-4">
                 <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">❗</div>
                 <div>
                    <p className="text-brand-navy font-bold">Inflamación Crónica</p>
                    <p className="text-sm text-slate-500">Rigidez que no te permite moverte libremente.</p>
                 </div>
              </div>
              <div className="p-5 bg-red-50 rounded-2xl border border-red-100/50 flex items-start gap-4">
                 <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">❗</div>
                 <div>
                    <p className="text-brand-navy font-bold">Desgaste Irreversible</p>
                    <p className="text-sm text-slate-500">Cada día sin tratamiento es un paso hacia la cirugía.</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sub-section: The Solution */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy leading-tight">
              Diseñado para que <span className="text-green-600">vuelva tu sonrisa.</span>
            </h2>
            <p className="text-lg text-slate-600 font-body leading-relaxed">
              Imagina despertar y sentir tus articulaciones ligeras. Funrich Joint Health rellena las micro-fisuras del cartílago, devolviéndole su amortiguación natural.
            </p>
            
             <ul className="grid gap-4 pt-4">
                {[
                  { title: 'Movilidad Total', desc: 'Siente tus rodillas y caderas lubricadas.', icon: '⚡' },
                  { title: 'Regeneración Pura', desc: 'Glucosamina de alta biodisponibilidad.', icon: '🧪' },
                  { title: 'Vida sin Límites', desc: 'Camina kilómetros sin una gota de dolor.', icon: '🏃' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 bg-green-50 p-4 rounded-2xl border border-green-100">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-brand-navy font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-green-700/70">{item.desc}</p>
                    </div>
                  </li>
                ))}
             </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2 relative"
          >
            <div className="absolute -inset-4 bg-green-100 rounded-[3rem] blur-2xl opacity-40 -z-10" />
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img src="/lifestyle_active_seniors.png" alt="Abuelos activos viviendo felices" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/40 to-transparent" />
              <div className="absolute top-8 right-8 bg-green-600 text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                Tu Nueva Vida
              </div>
            </div>
            
            <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 -right-4 glass px-8 py-6 rounded-3xl shadow-2xl border-white/20 max-w-[280px]"
            >
               <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold text-xl">10</div>
                  <p className="text-xs font-bold leading-tight">Días promedio para notar el primer alivio profundo.</p>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
