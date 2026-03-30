import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Truck, Sparkles, Timer, Activity, Ban, MapPin, MessageCircle, Leaf, Shield } from 'lucide-react';

// TikTok Pixel Type
declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: any) => void;
    };
  }
}

export default function LandingPage() {
  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({
    nombre: '',
    telefono: '',
    ciudad: '',
    distrito: '',
    direccion: '',
    referencia: '',
    hora: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [paquete, setPaquete] = useState('2 Frascos (S/ 139.00)');
  const [stock, setStock] = useState(14);
  const [timeLeft, setTimeLeft] = useState(23 * 60);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // GPS State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // Refs for videos
  const promoVideoRef = useRef<HTMLVideoElement>(null);

  // GPS Request logic (from Curcuma)
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('loading');
    
    let watchId: number;
    let bestPos: GeolocationPosition | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    const finalize = (pos: GeolocationPosition | null) => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
      if (pos) {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus('granted');
      } else {
        setGeoStatus('denied');
        alert('📍 No logramos obtener tu ubicación exacta. Asegúrate de tener el GPS activado.');
      }
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        bestPos = position;
        if (position.coords.accuracy <= 40) finalize(position);
      },
      (error) => {
        if (bestPos) finalize(bestPos);
        else {
          console.error('GPS Error:', error);
          setGeoStatus('denied');
          clearTimeout(timeoutId);
          alert('📍 Por favor, habilita el GPS para que el transportista llegue a tu casa.');
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );

    timeoutId = setTimeout(() => finalize(bestPos), 8000);
  };

  // Scroll and Timers
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });

    const handleScroll = () => {
      const formEl = document.getElementById('formulario-compra');
      let formVisible = false;
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        formVisible = rect.top < window.innerHeight && rect.bottom > 0;
      }
      setShowFloatingCTA(window.scrollY > 400 && !formVisible);
    };

    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    const stockTimer = setInterval(() => setStock(prev => (prev > 3 && Math.random() > 0.5 ? prev - 1 : prev)), 12000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
      clearInterval(stockTimer);
    };
  }, []);

  // Video Autoplay Observer
  useEffect(() => {
    const video = promoVideoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.1 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };
  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) error = 'Este campo es obligatorio';
    else if (name === 'telefono' && !/^\d{9}$/.test(value)) error = 'Ingresa 9 dígitos (ej. 999888777)';
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = ['nombre','telefono','ciudad','distrito','direccion','referencia','hora'];
    const allValid = fields.every(f => validateField(f, formData[f]));
    setTouched(Object.fromEntries(fields.map(f => [f, true])));
    
    if (!allValid) return;
    if (geoStatus !== 'granted') {
      alert("📍 Por favor, comparte tu ubicación GPS para confirmar el pedido.");
      requestLocation();
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const confirmOrder = () => {
    const phoneNumber = "51919749480"; // Mismo que Curcuma
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-200">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-2 px-4 sticky top-0 z-[60] border-b border-amber-500/20 text-center">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Envío Gratis a todo el Perú - Pago al Recibir</span>
          <Timer className="w-3 h-3 text-amber-500 ml-2" />
          <span className="text-amber-400 font-bold tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </div>
      {/* Product Hero Section */}
      <section data-aos="fade-up" className="relative pt-12 pb-20 px-4 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
              <Sparkles className="w-3 h-3" /> ¡Fórmula Original American "FUNRICH"!
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1]">
              Libérate del Dolor con <span className="text-amber-600">FUNRICH</span> Joint Health.
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              La solución definitiva con Glucosamina, Condroitina y MSM que regenera tus articulaciones y devuelve la alegría a tus movimientos.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic text-sm">
                 🚚 Pago Contraentrega en todo el Perú
               </div>
            </div>
            <button onClick={() => document.getElementById('formulario-compra')?.scrollIntoView({behavior:'smooth'})} className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 text-lg uppercase">
              ¡Quiero mi Kit FUNRICH!
            </button>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-200 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <img src="/original_bottle.png" alt="Funrich Joint Health Original" className="relative z-10 w-full max-w-sm mx-auto drop-shadow-2xl animate-float-slow" />
          </div>
        </div>
      </section>

      {/* Empathy Section: Problem vs Solution */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right" className="relative">
              <div className="absolute -inset-4 bg-red-100 rounded-[3rem] blur-2xl opacity-30"></div>
              <img src="/knee_pain_problem.png" alt="Dolor de rodilla" className="relative z-10 rounded-[3rem] shadow-2xl border-8 border-white" />
              <div className="absolute top-8 left-8 bg-red-600 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl pointer-events-none">Sientes esto...</div>
            </div>
            <div data-aos="fade-left" className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">No dejes que el desgaste te quite tus mejores años.</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                El dolor articular no es solo molestia física, es la pérdida de momentos con tu familia, de tus caminatas matutinas y de tu independencia.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-amber-800 font-bold text-sm mb-1">Sin Intervenciones</p>
                  <p className="text-xs text-amber-700/70">Evita cirugías costosas y riesgosas con nutrición preventiva.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-800 font-bold text-sm mb-1">Resultados Reales</p>
                  <p className="text-xs text-slate-700/70">Miles de peruanos ya caminan sin miedo gracias a Funrich.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center mt-24">
            <div data-aos="fade-right" className="order-2 md:order-1 space-y-8">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Vuelve a lo que realmente <span className="text-amber-600">te hace feliz.</span></h2>
               <p className="text-lg text-slate-600 leading-relaxed">
                 Imagina despertar sin rigidez, subir escaleras sin apoyo y caminar horas sin cansancio. La fórmula completa de Funrich Joint Health regenera el tejido conectivo para que tu cuerpo se sienta joven otra vez.
               </p>
               <ul className="space-y-4">
                 {[
                   'Movilidad total en rodillas y caderas',
                   'Desinflamación natural sin químicos',
                   'Fortalecimiento de cartílagos delgados'
                 ].map((text, i) => (
                   <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                     <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</div>
                     {text}
                   </li>
                 ))}
               </ul>
            </div>
            <div data-aos="fade-left" className="order-1 md:order-2 relative">
              <div className="absolute -inset-4 bg-green-100 rounded-[3rem] blur-2xl opacity-30"></div>
              <img src="/lifestyle_active_seniors.png" alt="Vida activa" className="relative z-10 rounded-[3rem] shadow-2xl border-8 border-white" />
              <div className="absolute top-8 right-8 bg-green-600 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl pointer-events-none">Tu nueva vida</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recreated eBay Info Section (Benefits grid) */}
      <section className="bg-slate-50 py-20 px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-slate-900 tracking-tight">
            ¿Por qué elegir Funrich Joint Health?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-amber-300 transition-all hover:shadow-xl group">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fórmula Premium</h3>
              <p className="text-slate-600 leading-relaxed">Combinación exacta de Glucosamina, Condroitina, MSM y Cúrcuma para una regeneración integral.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-amber-300 transition-all hover:shadow-xl group">
               <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Alivio Rápido</h3>
              <p className="text-slate-600 leading-relaxed">Reduce la inflamación y rigidez articular en tiempo récord, devolviéndote la agilidad perdida.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-amber-300 transition-all hover:shadow-xl group">
               <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Protección Total</h3>
              <p className="text-slate-600 leading-relaxed">No solo alivia el dolor, sino que protege tus cartílagos del desgaste futuro. Ideal para deportistas y adultos mayores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Diagram Section */}
      <section className="py-24 px-4 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 data-aos="fade-up" className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Alimentación Articular <span className="text-amber-600">Inteligente</span></h2>
             <p data-aos="fade-up" className="text-lg text-slate-600">Mira cómo la Glucosamina y Condroitina de Funrich penetran en el cartílago dañado para reconstruirlo desde el núcleo.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div data-aos="zoom-in" className="relative">
                <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full"></div>
                <img src="/cartilage_science_diagram.png" alt="Diagrama Ciencia" className="relative z-10 rounded-[3rem] shadow-2xl border-4 border-amber-200" />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-amber-100 max-w-[200px]">
                   <p className="text-amber-600 font-bold mb-1">Máxima Absorción</p>
                   <p className="text-[10px] text-slate-500">Nuestra fórmula micronizada garantiza que el 98% de los nutrientes lleguen a la articulación.</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { area: 'Cuello', desc: 'Reduce rigidez cervical' },
                  { area: 'Espalda', desc: 'Alivia tensión lumbar' },
                  { area: 'Manos', desc: 'Mejora agarre y fuerza' },
                  { area: 'Rodillas', desc: 'Elimina el dolor al caminar' },
                  { area: 'Caderas', desc: 'Aumenta rango de giro' },
                  { area: 'Pies', desc: 'Soporta el peso sin ardor' }
                ].map((item, i) => (
                  <div key={i} data-aos="fade-up" data-delay={i*100} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-10 h-10 bg-slate-100 rounded-xl mb-3 flex items-center justify-center text-amber-600 font-black">
                       <Activity className="w-5 h-5"/>
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">{item.area}</h4>
                     <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Infographic recreated in HTML/CSS */}
      <section className="py-20 px-4 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Información Nutricional Avanzada</h2>
            <p className="text-slate-400">Todo lo que necesitas en una sola cápsula de alta potencia. Sin rellenos, solo ingredientes puros.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
             <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center">
               <p className="text-amber-500 font-black text-2xl mb-1">1500mg</p>
               <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400 mb-2">Glucosamina</p>
               <p className="text-xs text-slate-300">Base estructural para el cartílago sano.</p>
             </div>
             <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center">
               <p className="text-amber-500 font-black text-2xl mb-1">150mg</p>
               <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400 mb-2">Condroitina</p>
               <p className="text-xs text-slate-300">Resistencia contra la presión y el peso.</p>
             </div>
             <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center">
               <p className="text-amber-500 font-black text-2xl mb-1">200mg</p>
               <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400 mb-2">Boswellia</p>
               <p className="text-xs text-slate-300">Máximo poder antiinflamatorio natural.</p>
             </div>
             <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center">
               <p className="text-amber-500 font-black text-2xl mb-1">150mg</p>
               <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400 mb-2">Cúrcuma</p>
               <p className="text-xs text-slate-300">Alivio inmediato y protección celular.</p>
             </div>
             <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center">
               <p className="text-amber-500 font-black text-2xl mb-1">25mg</p>
               <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400 mb-2">MSM</p>
               <p className="text-xs text-slate-300">Nutriente esencial para tejidos elásticos.</p>
             </div>
          </div>
          <div className="mt-16 flex justify-center">
             <img src="/funrich_ingredients_info.png" alt="Información Nutricional FUNRICH Original" className="rounded-3xl border-2 border-slate-700 max-w-full md:max-w-4xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Trust & Quality Section */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-10 uppercase tracking-tight">Estándares de Calidad <span className="text-amber-600">Internacional</span></h2>
          <div className="relative group">
            <img src="/quality_trust_seals.png" alt="Sellos de Calidad" className="mx-auto max-w-full md:max-w-3xl rounded-2xl shadow-lg border border-slate-100 transition-transform group-hover:scale-[1.01]" />
          </div>
          <p className="mt-8 text-slate-500 text-sm font-medium">Cada frasco de Funrich Joint Health es sometido a pruebas de terceros para garantizar la pureza, potencia y ausencia de metales pesados.</p>
        </div>
      </section>

      {/* Formulario de Compra (Checkout) */}
      <section id="formulario-compra" className="py-24 px-4 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">¡Haz tu pedido hoy mismo!</h2>
            <p className="text-slate-600 text-lg">Paga en efectivo al recibir el producto en tu puerta.</p>
            <div className="mt-8 flex justify-center relative">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-slate-100 rounded-3xl -z-10"></div>
              <video 
                src="/womans_hands_grasping.mp4" 
                className="h-64 md:h-80 w-auto rounded-3xl shadow-2xl border-4 border-white"
                autoPlay loop muted playsInline
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 ring-1 ring-slate-900/5">
            {/* Stock Bar */}
            <div className="bg-amber-50 rounded-2xl p-6 mb-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest flex items-center gap-1"><Ban className="w-3 h-3 text-red-500 animate-pulse"/> Inventario Limitado</span>
                <span className="text-red-600 font-black text-xs">SOLO {stock} UNIDADES</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(stock/14)*100}%` }}></div>
              </div>
            </div>

            {/* Visual Pricing Tiers */}
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Pruébalo', title: '1 Frasco', price: '79.00', img: '/funrich_pack_1.png' },
                { label: 'Best Seller', title: '2 Frascos', price: '139.00', img: '/funrich_pack_2.png' },
                { label: 'Ahorro Total', title: '3 Frascos', price: '189.00', img: '/funrich_pack_3.png' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPaquete(`${item.title} (S/ ${item.price})`)}
                  className={`relative group bg-white rounded-3xl border-2 transition-all p-4 ${
                    paquete.includes(item.title) ? 'border-amber-500 ring-4 ring-amber-500/10 shadow-xl' : 'border-slate-100 hover:border-amber-200 shadow-sm'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10">
                    {item.label}
                  </div>
                  <div className="aspect-square mb-4 overflow-hidden rounded-2xl bg-slate-50 relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-bold text-base">{item.title}</p>
                    <p className="text-2xl font-black text-amber-600">S/ {item.price}</p>
                  </div>
                  {paquete.includes(item.title) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white">
                      <Sparkles className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              {[
                { name: 'nombre', label: 'Nombre Completo', placeholder: 'Ej: Juan Pérez' },
                { name: 'telefono', label: 'Teléfono (WhatsApp)', placeholder: '9XXXXXXXX' },
                { name: 'ciudad', label: 'Ciudad', placeholder: 'Ej: Lima' },
                { name: 'distrito', label: 'Distrito', placeholder: 'Ej: Miraflores' },
                { name: 'direccion', label: 'Dirección de Entrega', placeholder: 'Av. / Calle / Nro' },
                { name: 'referencia', label: 'Referencia', placeholder: 'Referencia de la casa' }
              ].map((input) => (
                <div key={input.name}>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{input.label}</label>
                  <input
                    name={input.name}
                    value={formData[input.name]}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder={input.placeholder}
                    className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      touched[input.name] && formErrors[input.name] ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:ring-amber-500/20'
                    }`}
                  />
                  {touched[input.name] && formErrors[input.name] && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{formErrors[input.name]}</p>}
                </div>
              ))}
              <div className="md:col-span-2">
                 <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">¿En qué horario prefieres recibirlo?</label>
                 <select 
                    name="hora" value={formData.hora} onChange={handleInputChange} onBlur={handleBlur}
                    className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all appearance-none ${
                      touched.hora && formErrors.hora ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:ring-amber-500/20'
                    }`}
                 >
                    <option value="" disabled>Selecciona un horario...</option>
                    <option value="Mañana (8am - 12pm)">Mañana (8am - 12pm)</option>
                    <option value="Tarde (12pm - 4pm)">Tarde (12pm - 4pm)</option>
                    <option value="Noche (4pm - 8pm)">Noche (4pm - 8pm)</option>
                    <option value="Cualquier hora">Cualquier hora (8am - 8pm)</option>
                 </select>
                 {touched.hora && formErrors.hora && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{formErrors.hora}</p>}
              </div>

              {/* GPS Status */}
              <div className="md:col-span-2 pt-4">
                 <div className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                   geoStatus === 'granted' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                 }`}>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${geoStatus === 'granted' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                     <MapPin className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      {geoStatus === 'granted' ? (
                        <>
                          <h4 className="text-sm font-bold">Ubicación GPS Detectada ✓</h4>
                          <p className="text-[10px] font-mono opacity-60">Lat: {userCoords?.lat.toFixed(4)} | Lng: {userCoords?.lng.toFixed(4)}</p>
                        </>
                      ) : (
                        <button type="button" onClick={requestLocation} className="text-sm font-bold underline flex items-center gap-1">
                          {geoStatus === 'loading' ? 'Obteniendo GPS...' : '📍 Click aquí para activar GPS (Requerido)'}
                        </button>
                      )}
                   </div>
                 </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-10 bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-wider flex items-center justify-center gap-3 animate-pulse-slow">
              <MessageCircle className="w-6 h-6" /> Confirmar Mi Pedido
            </button>
          </form>
        </div>
      </section>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden animate-zoom-in">
             <div className="absolute top-0 inset-x-0 h-2 bg-green-500"></div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">¡Casi listo!</h3>
             <p className="text-slate-500 text-sm mb-6">Confirma tu pedido por WhatsApp para que podamos coordinar la entrega gratuita hoy mismo.</p>
             <div className="bg-slate-50 p-4 rounded-2xl space-y-2 mb-8 text-xs border border-slate-100">
                <div className="flex justify-between"><span className="text-slate-400">Producto:</span><span className="font-bold">Funrich Joint</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Paquete:</span><span className="font-bold">{paquete.split('(')[0]}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-2"><span className="text-slate-900 font-bold uppercase">Total a Pagar:</span><span className="font-black text-amber-600">{paquete.split('(')[1]?.replace(')','')}</span></div>
             </div>
             <button onClick={confirmOrder} className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mb-3">
               <MessageCircle className="w-5 h-5"/> Abrir WhatsApp
             </button>
             <button onClick={() => setIsConfirmModalOpen(false)} className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest py-2">Cancelar</button>
          </div>
        </div>
      )}

      {/* Floating CTA */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${showFloatingCTA ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
        <button onClick={() => document.getElementById('formulario-compra')?.scrollIntoView({behavior:'smooth'})} className="bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 animate-bounce shadow-green-500/30">
          <Truck className="w-6 h-6" />
          <span className="text-sm font-black uppercase tracking-widest pr-2 hidden md:inline">Pedir ahora</span>
        </button>
      </div>

    </div>
  );
}

