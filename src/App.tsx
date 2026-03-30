import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Truck, ShieldCheck, Sparkles, Timer, Activity, Heart, Flame, Star, Ban } from 'lucide-react';

// Images are now in the public folder

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
  const [stock, setStock] = useState(30);
  const [timeLeft, setTimeLeft] = useState(23 * 60);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stock simulation
  useEffect(() => {
    const stockTimer = setInterval(() => {
      setStock(prev => (prev > 3 && Math.random() > 0.5 ? prev - 1 : prev));
    }, 12000);
    return () => clearInterval(stockTimer);
  }, []);

  // AOS init
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };
  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) error = 'Este campo es obligatorio';
    if (name === 'telefono' && !/^\d{9}$/.test(value)) error = 'Ingresa un número válido de 9 dígitos';
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = ['nombre','telefono','ciudad','distrito','direccion','referencia','hora'];
    const allValid = fields.every(f => validateField(f, formData[f]));
    setTouched(Object.fromEntries(fields.map(f => [f, true])));
    if (!allValid) return;
    setIsConfirmModalOpen(true);
  };
  const confirmOrder = () => {
    setIsConfirmModalOpen(false);
    alert('¡Pedido enviado!');
  };

  // Helper for timer display
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 shadow-xl sticky top-0 z-50 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-amber-400 mr-2 animate-pulse" />
        <span className="text-xs font-bold uppercase">Envío Gratis a todo el Perú</span>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 py-12 md:py-20" data-aos="fade-up">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">
              Funirich Joint Health – <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">Salud Articular</span>
            </h1>
            <p className="text-lg text-gray-700">
              Fórmula premium con glucosamina, condroitina, MSM y cúrcuma para fortalecer tus articulaciones, reducir la inflamación y recuperar la movilidad.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => setPaquete('1 Frasco (S/ 79.00)')} className={`p-4 rounded-xl border-2 text-sm font-bold ${paquete.includes('1 Frasco') ? 'border-amber-500 bg-amber-500 text-white' : 'border-amber-200 bg-white text-slate-700 hover:bg-amber-50'}`}>1 Frasco – S/ 79.00</button>
              <button onClick={() => setPaquete('2 Frascos (S/ 139.00)')} className={`p-4 rounded-xl border-2 text-sm font-bold ${paquete.includes('2 Frascos') ? 'border-amber-500 bg-amber-500 text-white' : 'border-amber-200 bg-white text-slate-700 hover:bg-amber-50'}`}>2 Frascos – S/ 139.00</button>
              <button onClick={() => setPaquete('3 Frascos (S/ 189.00)')} className={`p-4 rounded-xl border-2 text-sm font-bold ${paquete.includes('3 Frascos') ? 'border-amber-500 bg-amber-500 text-white' : 'border-amber-200 bg-white text-slate-700 hover:bg-amber-50'}`}>3 Frascos – S/ 189.00</button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-amber-800">
              <Timer className="w-4 h-4" />
              <span>La oferta expira en: {formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <Ban className="w-4 h-4" />
              <span>Solo quedan {stock} unidades</span>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/original_bottle.png" alt="Funirich Joint Health" className="h-64 md:h-80 object-contain drop-shadow-2xl animate-float" />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8" data-aos="fade-up">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 rounded-2xl border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md">
            <Truck className="w-8 h-8 text-amber-500" />
            <h3 className="font-bold mt-2">Envío Gratis</h3>
            <p className="text-sm text-gray-600 text-center">A todo el país, sin costos ocultos.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <h3 className="font-bold mt-2">Pago Seguro</h3>
            <p className="text-sm text-gray-600 text-center">Paga al recibir el producto. Sin riesgos.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md">
            <Star className="w-8 h-8 text-amber-500" />
            <h3 className="font-bold mt-2">100% Original</h3>
            <p className="text-sm text-gray-600 text-center">Producto de laboratorio sin RS ni NS.</p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-slate-50 py-12" data-aos="fade-up" id="beneficios">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Beneficios Clave</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-amber-500" />
                <h3 className="font-semibold text-lg">Regenera Cartílagos</h3>
              </div>
              <p>Glucosamina y condroitina trabajan en sinergia para reparar y fortalecer el cartílago.</p>
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-amber-500" />
                <h3 className="font-semibold text-lg">Mayor Flexibilidad</h3>
              </div>
              <p>MSM reduce la rigidez y mejora la movilidad diaria.</p>
              <div className="flex items-center space-x-2">
                <Flame className="w-6 h-6 text-amber-500" />
                <h3 className="font-semibold text-lg">Anti‑inflamatorio Natural</h3>
              </div>
              <p>Cúrcuma actúa como potente antioxidante y disminuye la inflamación.</p>
            </div>
            <div className="flex justify-center">
              <video src="/video-promocional-curcuma.mp4" autoPlay loop muted className="rounded-lg shadow-lg w-full max-w-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredientes */}
      <section className="bg-white py-12" data-aos="fade-up" id="ingredientes">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ingredientes Premium</h2>
          <img src="/funirich_ingredients_info.png" alt="Ingredientes Funirich" className="mx-auto max-w-full" />
        </div>
      </section>

      {/* Formulario de Pedido */}
      <section className="bg-slate-900 text-white py-16" data-aos="fade-up" id="formulario">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Completa tus datos para coordinar la entrega</h2>
          <p className="text-center mb-8">Paga en casa al recibir tu producto. ¡Sin riesgos!</p>
          <div className="flex justify-center mb-6">
            <img src="/original_bottle.png" alt="Funirich Joint Health" className="h-48 md:h-64 object-contain" />
          </div>
          <form className="bg-white p-6 rounded-2xl shadow-xl" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nombre Completo</label>
                <input name="nombre" value={formData.nombre} onChange={handleInputChange} onBlur={handleBlur} className={`w-full p-2 border rounded ${touched.nombre && formErrors.nombre ? 'border-red-500' : 'border-amber-400'}`} placeholder="Ej. Juan Pérez" />
                {touched.nombre && formErrors.nombre && <p className="text-red-500 text-xs mt-1 flex items-center"><Ban className="w-3 h-3 mr-1" />{formErrors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Teléfono (WhatsApp)</label>
                <input name="telefono" value={formData.telefono} onChange={handleInputChange} onBlur={handleBlur} className={`w-full p-2 border rounded ${touched.telefono && formErrors.telefono ? 'border-red-500' : 'border-amber-400'}`} placeholder="Ej. 999888777" />
                {touched.telefono && formErrors.telefono && <p className="text-red-500 text-xs mt-1 flex items-center"><Ban className="w-3 h-3 mr-1" />{formErrors.telefono}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Ciudad</label>
                <input name="ciudad" value={formData.ciudad} onChange={handleInputChange} onBlur={handleBlur} className={`w-full p-2 border rounded ${touched.ciudad && formErrors.ciudad ? 'border-red-500' : 'border-amber-400'}`} placeholder="Ej. Lima" />
                {touched.ciudad && formErrors.ciudad && <p className="text-red-500 text-xs mt-1 flex items-center"><Ban className="w-3 h-3 mr-1" />{formErrors.ciudad}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Distrito</label>
                <input name="distrito" value={formData.distrito} onChange={handleInputChange} onBlur={handleBlur} className={`w-full p-2 border rounded ${touched.distrito && formErrors.distrito ? 'border-red-500' : 'border-amber-400'}`} placeholder="Ej. Miraflores" />
                {touched.distrito && formErrors.distrito && <p className="text-red-500 text-xs mt-1 flex items-center"><Ban className="w-3 h-3 mr-1" />{formErrors.distrito}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Dirección de entrega</label>
                <input name="direccion" value={formData.direccion} onChange={handleInputChange} onBlur={handleBlur} className={`w-full p-2 border rounded ${touched.direccion && formErrors.direccion ? 'border-red-500' : 'border-amber-400'}`} placeholder="Ej. Av. Los Pinos 123" />
                {touched.direccion && formErrors.direccion && <p className="text-red-500 text-xs mt-1 flex items-center"><Ban className="w-3 h-3 mr-1" />{formErrors.direccion}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Referencia</label>
                <input name="referencia" value={formData.referencia} onChange={handleInputChange} onBlur={handleBlur} className={`w-full p-2 border rounded ${touched.referencia && formErrors.referencia ? 'border-red-500' : 'border-amber-400'}`} placeholder="Ej. Casa azul" />
                {touched.referencia && formErrors.referencia && <p className="text-red-500 text-xs mt-1 flex items-center"><Ban className="w-3 h-3 mr-1" />{formErrors.referencia}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Hora sugerida de entrega</label>
                <input name="hora" type="time" value={formData.hora} onChange={handleInputChange} onBlur={handleBlur} className={`w-full p-2 border rounded ${touched.hora && formErrors.hora ? 'border-red-500' : 'border-amber-400'}`} />
                {touched.hora && formErrors.hora && <p className="text-red-500 text-xs mt-1 flex items-center"><Ban className="w-3 h-3 mr-1" />{formErrors.hora}</p>}
              </div>
            </div>
            <button type="submit" className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">
              Confirmar Pedido
            </button>
          </form>
        </div>
      </section>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">¡Gracias por tu compra!</h3>
            <p>Te contactaremos pronto para confirmar la entrega.</p>
            <button onClick={confirmOrder} className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

