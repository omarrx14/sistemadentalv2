import { LayoutDashboard, Users, Calendar, Activity, DollarSign, Settings, LogOut, Search } from 'lucide-react';
import { useDentalStore } from '../../store/useDentalStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const { activeView, setActiveView, patients, setSelectedPatient, selectedPatientId } = useDentalStore();
  const [patientSearch, setPatientSearch] = useState('');

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'odontograma', label: 'Odontograma', icon: Activity },
    { id: 'finanzas', label: 'Finanzas', icon: DollarSign },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-20 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <Activity size={24} />
          </div>
          <span className="font-bold text-xl text-dark">DentalPro</span>
        </div>

        <nav className="space-y-1 mb-10">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm",
                activeView === item.id 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-dark"
              )}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mb-6">
          <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Seleccionar paciente</h3>
          <div className="px-2 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Buscar..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          
          <div className="space-y-1 max-h-48 overflow-y-auto px-2">
            {filteredPatients.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors truncate",
                  selectedPatientId === p.id 
                    ? "bg-primary/10 text-primary font-bold" 
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {p.name}
              </button>
            ))}
            {filteredPatients.length === 0 && (
              <p className="text-center py-4 text-[11px] text-slate-400">Sin resultados</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center font-bold text-primary">
            CL
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-dark truncate">Dra. Carmen López</p>
            <p className="text-[10px] text-slate-500 truncate">Odontología General</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 transition-colors text-xs font-medium">
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
