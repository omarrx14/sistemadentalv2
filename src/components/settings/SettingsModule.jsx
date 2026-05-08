import { User, Shield, Bell, Database, Globe, Moon } from 'lucide-react';

const SettingsModule = () => {
  const sections = [
    { title: 'Perfil de la Clínica', icon: User, desc: 'Nombre, dirección, logo y datos fiscales.' },
    { title: 'Seguridad', icon: Shield, desc: 'Contraseñas, permisos de usuario y roles.' },
    { title: 'Notificaciones', icon: Bell, desc: 'Configuración de recordatorios vía Email/WhatsApp.' },
    { title: 'Datos y Respaldo', icon: Database, desc: 'Exportar historial de pacientes y copias de seguridad.' },
    { title: 'Idioma y Región', icon: Globe, desc: 'Zona horaria, moneda y formato de fecha.' },
    { title: 'Personalización', icon: Moon, desc: 'Modo oscuro, colores de marca y temas.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-dark">Configuración del Sistema</h2>
        <p className="text-slate-500 text-sm">Personaliza tu experiencia y gestiona la clínica</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <button 
            key={index}
            className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary/40 hover:shadow-md transition-all text-left group"
          >
            <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary rounded-xl transition-colors">
              <section.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-dark group-hover:text-primary transition-colors">{section.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{section.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 mt-12">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-primary">Plan Profesional</h4>
            <p className="text-sm text-slate-600">Tu suscripción vence en 245 días.</p>
          </div>
          <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary/20">
            Mejorar Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
