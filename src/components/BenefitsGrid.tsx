import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, HeartPulse, Zap, Clock, ThumbsUp } from 'lucide-react';

export const BenefitsGrid: React.FC = () => {
  const benefits = [
    { title: 'Regeneración Profunda', desc: 'Repara el cartílago dañado a nivel celular con Glucosamina pura.', icon: <Activity className="w-8 h-8" /> },
    { title: 'Alivio en 14 Días', desc: 'Siente la diferencia en tus articulaciones en dos semanas o menos.', icon: <Timer className="w-8 h-8" /> },
    { title: 'Fórmula Sin Químicos', desc: 'Basado en extractos naturales de alta potencia y pureza médica.', icon: <ShieldCheck className="w-8 h-8" /> },
    { title: 'Protección Futura', desc: 'Evita el desgaste prematuro y protege tus huesos del envejecimiento.', icon: <HeartPulse className="w-8 h-8" /> },
    { title: 'Absorción Máxima', desc: 'Nuestra tecnología micronizada garantiza que el cuerpo aproveche el 98% del contenido.', icon: <Zap className="w-8 h-8" /> },
    { title: 'Confianza Médica', desc: 'Utilizado por deportistas y adultos mayores en todo el Perú.', icon: <ThumbsUp className="w-8 h-8" /> }
  ];

  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
           <h2 className="text-4xl md:text-5xl font-heading font-black text-brand-navy">El Diferencial <span className="text-brand-gold">Funrich</span></h2>
           <p className="text-slate-500 font-body text-lg max-w-2xl mx-auto">Calidad superior para quienes no se conforman con lo básico.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {benefits.map((ben, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -10 }}
               className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-brand-gold/20 transition-premium group"
             >
               <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-navy group-hover:text-white transition-premium">
                  {ben.icon}
               </div>
               <h3 className="text-xl font-heading font-bold text-brand-navy mb-4">{ben.title}</h3>
               <p className="text-slate-500 font-body text-sm leading-relaxed">{ben.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const Timer = ({ className }: { className?: string }) => <Clock className={className} />;
