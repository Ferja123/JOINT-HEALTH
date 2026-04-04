import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, MessageCircle, Sparkles, AlertTriangle, ShieldCheck, ChevronDown } from 'lucide-react';

interface OrderFormProps {
  stock: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({ stock }) => {
  const [paquete, setPaquete] = useState('2 Frascos (S/ 139.00)');
  const [formData, setFormData] = useState<Record<string, string>>({
    nombre: '',
    telefono: '',
    ciudad: '',
    distrito: '',
    direccion: '',
    referencia: '',
    hora: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const packs = [
    { label: 'Pruébalo', title: '1 Frasco', price: '79.00', img: '/funrich_pack_1.png', saved: '0%' },
    { label: 'Más Popular', title: '2 Frascos', price: '139.00', img: '/funrich_pack_2.png', saved: '30%' },
    { label: 'Mejor Valor', title: '3 Frascos', price: '189.00', img: '/funrich_pack_3.png', saved: '45%' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) error = 'Este campo es obligatorio';
    else if (name === 'telefono' && !/^\d{9}$/.test(value)) error = 'Ingresa 9 dígitos (ej. 999123456)';
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('loading');
    
    let watchId: number;
    let bestPos: GeolocationPosition | null = null;

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        bestPos = position;
        if (position.coords.accuracy <= 40) {
          setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setGeoStatus('granted');
          navigator.geolocation.clearWatch(watchId);
        }
      },
      () => setGeoStatus('denied'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    
    setTimeout(() => {
      if (bestPos && geoStatus === 'loading') {
         setUserCoords({ lat: bestPos.coords.latitude, lng: bestPos.coords.longitude });
         setGeoStatus('granted');
      }
      navigator.geolocation.clearWatch(watchId);
    }, 10000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = ['nombre', 'telefono', 'ciudad', 'distrito', 'direccion', 'referencia', 'hora'];
    const allValid = fields.every(f => validateField(f, formData[f]));
    setTouched(Object.fromEntries(fields.map(f => [f, true])));
    
    if (!allValid) return;
    if (geoStatus !== 'granted') {
      alert("📍 Se requiere ubicación GPS para la entrega gratuita.");
      requestLocation();
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const confirmOrder = () => {
    const phoneNumber = "51919749480";
    const message = `*NUEVO PEDIDO - FUNRICH JOINT HEALTH* 🦴\n\n` +
      `*Paquete:* ${paquete}\n` +
      `*Nombre:* ${formData.nombre}\n` +
      `*Teléfono:* ${formData.telefono}\n` +
      `*Ciudad/Dist:* ${formData.ciudad} - ${formData.distrito}\n` +
      `*Dirección:* ${formData.direccion}\n` +
      `*Referencia:* ${formData.referencia}\n` +
      `*Hora:* ${formData.hora}\n` +
      `📍 *GPS:* https://www.google.com/maps/search/?api=1&query=${userCoords?.lat},${userCoords?.lng}\n\n` +
      `*Pago Contraentrega* 🚚`;

    // TikTok Pixel (if available)
    if (window.ttq) {
      window.ttq.track('PlaceAnOrder', {
        content_name: paquete,
        currency: 'PEN',
        value: paquete.includes('79') ? 79 : paquete.includes('139') ? 139 : 189
      });
    }

    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
    setIsConfirmModalOpen(false);
  };

  return (
    <section id="ordenar" className="py-24 px-4 bg-slate-50 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
           <h2 className="text-4xl md:text-6xl font-heading font-black text-brand-navy">Completa tu Pedido</h2>
           <p className="text-slate-500 font-body text-lg">Paga en efectivo al recibir el producto. ¡Envío rápido garantizado!</p>
        </div>

        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl border border-slate-200">
           {/* Stock Urgency Bar */}
           <div className="bg-brand-navy/5 rounded-3xl p-6 mb-12 border border-brand-navy/5">
              <div className="flex justify-between items-center mb-4">
                 <span className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-navy tracking-[0.2em]">
                    <AlertTriangle className="w-4 h-4 text-brand-accent animate-pulse" />
                    Inventario de Oferta Crítico
                 </span>
                 <span className="text-brand-accent font-black text-sm">SOLO {stock} UNIDADES</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                 <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(stock/14)*100}%` }}
                    className="h-full bg-gradient-to-r from-brand-gold to-brand-accent"
                 />
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-3 text-center uppercase tracking-widest">Demás personas están reservando en este momento</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-10">
              {/* Pack Selection */}
              <div className="grid sm:grid-cols-3 gap-6">
                 {packs.map((pack, idx) => (
                    <button
                       key={idx}
                       type="button"
                       onClick={() => setPaquete(`${pack.title} (S/ ${pack.price})`)}
                       className={`relative group bg-white rounded-[2rem] border-2 transition-premium p-6 text-center ${
                          paquete.includes(pack.title) ? 'border-brand-gold bg-brand-gold/5 ring-4 ring-brand-gold/10 shadow-xl' : 'border-slate-100 hover:border-brand-gold/30 hover:shadow-lg'
                       }`}
                    >
                       <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                          {pack.label}
                       </div>
                       
                       <div className="aspect-square mb-6 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                          <img src={pack.img} alt={pack.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       
                       <div className="space-y-1">
                          <h4 className="text-brand-navy font-bold text-lg">{pack.title}</h4>
                          <div className="text-3xl font-black text-brand-navy">S/ {pack.price}</div>
                          <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Ahorras {pack.saved}</div>
                       </div>
                       
                       <AnimatePresence>
                          {paquete.includes(pack.title) && (
                            <motion.div 
                               initial={{ scale: 0 }} 
                               animate={{ scale: 1 }} 
                               exit={{ scale: 0 }}
                               className="absolute -top-2 -right-2 w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-white shadow-lg"
                            >
                               <Sparkles className="w-4 h-4 fill-current" />
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </button>
                 ))}
              </div>

              {/* Form Fields Grid */}
              <div className="grid md:grid-cols-2 gap-8 pt-8">
                 {[
                    { name: 'nombre', label: 'Nombre Completo', placeholder: 'Ej: Juan Pérez' },
                    { name: 'telefono', label: 'Teléfono / WhatsApp', placeholder: '9XXXXXXXX' },
                    { name: 'ciudad', label: 'Ciudad', placeholder: 'Ej: Lima' },
                    { name: 'distrito', label: 'Distrito', placeholder: 'Ej: Miraflores' },
                    { name: 'direccion', label: 'Dirección de Entrega', placeholder: 'Av. / Calle / Número' },
                    { name: 'referencia', label: 'Punto de Referencia', placeholder: 'Color de casa / frente a...' }
                 ].map((input) => (
                    <div key={input.name} className="relative group">
                       <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-brand-gold transition-colors">{input.label}</label>
                       <input
                          name={input.name}
                          value={formData[input.name]}
                          onChange={handleInputChange}
                          onBlur={(e) => {
                             setTouched(prev => ({ ...prev, [input.name]: true }));
                             validateField(input.name, e.target.value);
                          }}
                          placeholder={input.placeholder}
                          className={`w-full px-6 py-4 rounded-2xl border-2 transition-premium bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 ${
                             touched[input.name] && formErrors[input.name] ? 'border-red-500/50 focus:ring-red-500/10' : 'border-slate-100 focus:border-brand-gold/50 focus:ring-brand-gold/10'
                          }`}
                       />
                       {touched[input.name] && formErrors[input.name] && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-[10px] font-bold mt-2 uppercase tracking-tighter">
                             {formErrors[input.name]}
                          </motion.p>
                       )}
                    </div>
                 ))}
                 
                 <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Horario de Entrega Preferido</label>
                    <div className="relative">
                       <select 
                          name="hora" 
                          value={formData.hora} 
                          onChange={handleInputChange}
                          onBlur={(e) => {
                             setTouched(prev => ({ ...prev, hora: true }));
                             validateField('hora', e.target.value);
                          }}
                          className={`w-full px-6 py-4 rounded-2xl border-2 transition-premium bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 appearance-none ${
                             touched.hora && formErrors.hora ? 'border-red-500/50 focus:ring-red-500/10' : 'border-slate-100 focus:border-brand-gold/50 focus:ring-brand-gold/10'
                          }`}
                       >
                          <option value="" disabled>Selecciona un horario...</option>
                          <option value="Mañana (8am - 12pm)">Mañana (8am - 12pm)</option>
                          <option value="Tarde (12pm - 4pm)">Tarde (12pm - 4pm)</option>
                          <option value="Noche (4pm - 8pm)">Noche (4pm - 8pm)</option>
                          <option value="Cualquier hora">Cualquier hora (Flexible)</option>
                       </select>
                       <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                    {touched.hora && formErrors.hora && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tighter">{formErrors.hora}</p>}
                 </div>

                 {/* GPS Logic */}
                 <div className="md:col-span-2 pt-6">
                    <div className={`p-6 rounded-3xl border-2 transition-premium flex flex-col md:flex-row items-center gap-6 ${
                       geoStatus === 'granted' ? 'bg-green-50 border-green-200' : 'bg-brand-gold/5 border-brand-gold/20'
                    }`}>
                       <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                          geoStatus === 'granted' ? 'bg-green-100 text-green-600' : 'bg-brand-gold/20 text-brand-gold'
                       }`}>
                          <MapPin className="w-8 h-8" />
                       </div>
                       
                       <div className="flex-1 text-center md:text-left space-y-1">
                          {geoStatus === 'granted' ? (
                             <>
                                <h4 className="text-brand-navy font-bold text-lg">Ubicación Confirmada ✓</h4>
                                <p className="text-xs text-slate-500 font-medium">Lat {userCoords?.lat.toFixed(4)} | Lng {userCoords?.lng.toFixed(4)}</p>
                             </>
                          ) : (
                             <>
                                <h4 className="text-brand-navy font-bold text-lg">Activar Descuento con GPS</h4>
                                <p className="text-xs text-slate-500 mb-4">Ayuda al transportista a llegar exacto a tu casa activando tu GPS.</p>
                                <button 
                                   type="button" 
                                   onClick={requestLocation}
                                   className="text-brand-gold font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-brand-navy transition-colors"
                                >
                                   {geoStatus === 'loading' ? 'Localizando...' : 'Click para Compartir Ubicación'}
                                </button>
                             </>
                          )}
                       </div>
                       
                       {geoStatus === 'granted' && (
                          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                             Envío Garantizado
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              <motion.button 
                 whileHover={{ scale: 1.01 }}
                 whileTap={{ scale: 0.98 }}
                 type="submit" 
                 className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-6 rounded-3xl shadow-xl shadow-green-500/20 text-xl uppercase tracking-[0.1em] flex items-center justify-center gap-4 transition-premium group"
              >
                 <MessageCircle className="w-8 h-8" />
                 CONFIRMAR PEDIDO VÍA WHATSAPP
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-4 border-t border-slate-100">
                 <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Pago 100% Seguro</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-400">
                    <Truck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Entrega de 24h a 48h</span>
                 </div>
              </div>
           </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
         {isConfirmModalOpen && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-brand-navy/80 backdrop-blur-md z-[200] flex items-center justify-center p-4"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 inset-x-0 h-3 bg-brand-gold"></div>
                  <h3 className="text-3xl font-heading font-black text-brand-navy mb-4">🎉 ¡Excelente Elección!</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">Solo un paso más. Presiona el botón de abajo para que nuestro asesor confirme tu envío gratuito.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl space-y-3 mb-10 border border-slate-100 shadow-inner">
                     <div className="flex justify-between items-center"><span className="text-slate-400 text-xs">PRODUCTO:</span><span className="text-brand-navy font-bold text-xs uppercase">Funrich Joint</span></div>
                     <div className="flex justify-between items-center"><span className="text-slate-400 text-xs">PAQUETE:</span><span className="text-brand-navy font-bold text-xs uppercase">{paquete.split('(')[0]}</span></div>
                     <div className="flex justify-between items-center border-t border-slate-200 pt-3 mt-3"><span className="text-brand-navy font-black text-sm uppercase">TOTAL A PAGAR:</span><span className="text-brand-gold font-black text-xl">{paquete.split('(')[1]?.replace(')','')}</span></div>
                  </div>

                  <button 
                     onClick={confirmOrder} 
                     className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-500/30 flex items-center justify-center gap-3 transition-premium"
                  >
                     <MessageCircle className="w-6 h-6"/> COORDINAR POR WHATSAPP
                  </button>
                  
                  <button onClick={() => setIsConfirmModalOpen(false)} className="w-full text-slate-400 font-bold text-xs uppercase tracking-[0.2em] py-4 mt-2">Corregir Datos</button>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </section>
  );
};
