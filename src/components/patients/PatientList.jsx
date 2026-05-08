import { useState } from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { Search, UserPlus } from 'lucide-react';
import { clsx } from 'clsx';

const PatientList = () => {
  const { patients, selectedPatientId, setSelectedPatient } = useDentalStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-dark text-lg">Pacientes</h2>
          <button 
            onClick={() => setSelectedPatient('new')}
            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
            title="Agregar nuevo paciente"
          >
            <UserPlus size={20} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredPatients.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPatient(p.id)}
            className={clsx(
              "w-full text-left p-4 rounded-xl transition-all duration-200 border",
              selectedPatientId === p.id 
                ? "bg-primary/5 border-primary/20" 
                : "bg-white border-transparent hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                selectedPatientId === p.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
              )}>
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  "font-bold text-sm truncate",
                  selectedPatientId === p.id ? "text-primary" : "text-dark"
                )}>
                  {p.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{p.email}</p>
              </div>
            </div>
          </button>
        ))}
        {filteredPatients.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">No se encontraron pacientes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
