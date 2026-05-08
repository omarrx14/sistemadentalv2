import { useDentalStore } from '../../store/useDentalStore';
import { clsx } from 'clsx';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';

const Odontogram = () => {
  const { patients, selectedPatientId, updateToothStatus } = useDentalStore();
  const patient = patients.find(p => p.id === selectedPatientId);

  if (!patient) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 h-full flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
        <Activity size={40} />
      </div>
      <h2 className="font-bold text-dark text-xl mb-2">Odontograma</h2>
      <p className="text-slate-400 max-w-xs mx-auto">Sin paciente seleccionado. Selecciona un paciente de la lista en la barra lateral para ver su odontograma.</p>
    </div>
  );

  const getToothStyles = (status) => {
    switch (status) {
      case 0: // Sano
        return {
          bg: 'bg-white border-slate-200 text-slate-400',
          svgFill: '#2F80ED', // Azul original
          pathFill: 'white'
        };
      case 1: // Caries
        return {
          bg: 'bg-red-50 border-red-200 text-red-600',
          svgFill: '#EF4444', // Rojo
          pathFill: 'white'
        };
      case 2: // Tratado
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
          svgFill: '#10B981', // Verde
          pathFill: 'white'
        };
      default:
        return { bg: 'bg-white', svgFill: '#2F80ED', pathFill: 'white' };
    }
  };

  const handleToothClick = (patientId, toothId, currentStatus) => {
    updateToothStatus(patientId, toothId);
    const statuses = ['Sano', 'Caries', 'Tratado'];
    const nextStatus = statuses[(currentStatus + 1) % 3];
    toast(`Pieza ${toothId}: ${nextStatus}`, {
      icon: '🦷',
      duration: 2000,
    });
  };

  const topTeeth = patient.teeth.slice(0, 16);
  const bottomTeeth = patient.teeth.slice(16, 32);

  const ToothIcon = ({ status, id }) => {
    const styles = getToothStyles(status);
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-bold text-slate-400">{id}</span>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform active:scale-90 cursor-pointer">
          <rect width="32" height="32" rx="8" fill={styles.svgFill} className="transition-colors duration-300"/>
          <path d="M8 10c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4 0 1.5-.6 2.8-1.5 3.8L21 22c-.5 2-2 3-4 3h-2c-2 0-3.5-1-4-3l-1.5-8.2C8.6 12.8 8 11.5 8 10z" fill={styles.pathFill}/>
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-bold text-dark text-lg">Odontograma Clínico</h2>
          <p className="text-xs text-slate-500">Paciente: <span className="font-bold text-primary">{patient.name}</span></p>
        </div>
        <div className="flex gap-4 bg-slate-50 p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-sm"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Sano</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Caries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Tratado</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-around py-4 overflow-x-auto">
        <div className="min-w-[600px] lg:min-w-0">
          {/* Top Row */}
          <div className="grid grid-cols-8 gap-x-2 gap-y-6 justify-items-center mb-12">
            {topTeeth.map((tooth) => (
              <button
                key={tooth.id}
                onClick={() => handleToothClick(patient.id, tooth.id, tooth.status)}
                className="hover:scale-110 transition-transform"
              >
                <ToothIcon id={tooth.id} status={tooth.status} />
              </button>
            ))}
          </div>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* Bottom Row */}
          <div className="grid grid-cols-8 gap-x-2 gap-y-6 justify-items-center">
            {bottomTeeth.map((tooth) => (
              <button
                key={tooth.id}
                onClick={() => handleToothClick(patient.id, tooth.id, tooth.status)}
                className="hover:scale-110 transition-transform"
              >
                <ToothIcon id={tooth.id} status={tooth.status} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Historial de Piezas</h4>
        <div className="flex flex-wrap gap-2">
          {patient.teeth.filter(t => t.status !== 0).map(t => (
            <div key={t.id} className={clsx(
              "text-[10px] font-bold px-2 py-1 rounded-lg border",
              t.status === 1 ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
            )}>
              Pieza {t.id}: {t.status === 1 ? 'Caries' : 'Tratado'}
            </div>
          ))}
          {patient.teeth.every(t => t.status === 0) && <p className="text-xs text-slate-400 italic">No hay hallazgos clínicos recientes.</p>}
        </div>
      </div>
    </div>
  );
};

export default Odontogram;
