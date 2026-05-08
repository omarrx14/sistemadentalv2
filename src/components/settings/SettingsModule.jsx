import { useState } from 'react';
import { User, Shield, Bell, Database, Globe, Moon, Save, Building } from 'lucide-react';
import { useDentalStore } from '../../store/useDentalStore';
import { toast } from 'sonner';

const SettingsModule = () => {
  const { clinicProfile, updateClinicProfile } = useDentalStore();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({ ...clinicProfile });

  const sections = [
    { id: 'general', title: 'Perfil de la Clínica', icon: User, desc: 'Nombre, doctor y especialidad.' },
    { id: 'security', title: 'Seguridad', icon: Shield, desc: 'Contraseñas y permisos.' },
    { id: 'notif', title: 'Notificaciones', icon: Bell, desc: 'Recordatorios WhatsApp/Email.' },
    { id: 'data', title: 'Datos y Respaldo', icon: Database, desc: 'Exportar historial y backups.' },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.clinicName) {
      toast.error('Nombre del doctor y de la clínica son obligatorios');
      return;
    }
    
    // Auto-generate initials
    const initials = formData.doctorName
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0].toUpperCase())
      .slice(0, 2)
      .join('');

    updateClinicProfile({ ...formData, initials });
    toast.success('Perfil actualizado correctamente');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-dark">Configuración del Sistema</h2>
        <p className="text-slate-500 text-sm">Gestiona la identidad de tu clínica y ajustes del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-4 space-y-2">
          {sections.map((section) => (
            <button 
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${
                activeTab === section.id 
                  ? "bg-white border-primary/20 shadow-md shadow-primary/5" 
                  : "bg-transparent border-transparent hover:bg-white/50"
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-colors ${
                activeTab === section.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
              }`}>
                <section.icon size={20} />
              </div>
              <div>
                <h3 className={`font-bold text-sm ${activeTab === section.id ? "text-primary" : "text-dark"}`}>{section.title}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{section.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            {activeTab === 'general' ? (
              <form onSubmit={handleSaveProfile} className="space-y-8 animate-in slide-in-from-right-2 duration-300">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-primary border-2 border-dashed border-slate-200">
                    <Building size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg">Información Profesional</h3>
                    <p className="text-xs text-slate-500">Estos datos se mostrarán en recetas y en el sistema</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Nombre del Doctor(a)</label>
                    <input 
                      type="text" 
                      value={formData.doctorName}
                      onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Especialidad</label>
                    <input 
                      type="text" 
                      value={formData.specialty}
                      onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Nombre de la Clínica</label>
                    <input 
                      type="text" 
                      value={formData.clinicName}
                      onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <Save size={18} />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4 animate-in slide-in-from-right-2 duration-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Settings size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-dark italic">Módulo en Desarrollo</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Esta sección estará disponible en la próxima versión del software dental.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
