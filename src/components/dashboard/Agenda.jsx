import { useDentalStore } from '../../store/useDentalStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Agenda = () => {
  const { appointments, setSelectedPatient, selectedPatientId } = useDentalStore();

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completado': return 'bg-emerald-50 text-emerald-600';
      case 'En espera': return 'bg-amber-50 text-amber-600';
      case 'Pendiente': return 'bg-slate-50 text-slate-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-dark text-lg">Agenda del Día</h2>
        <button className="text-primary text-sm font-bold hover:underline">Ver todo</button>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <div 
            key={apt.id} 
            onClick={() => {
              if (apt.patientId) {
                setSelectedPatient(apt.patientId);
                // In a real app, you might also switch to the active patient view
              }
            }}
            className={cn(
              "group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
              selectedPatientId === apt.patientId 
                ? "border-primary/40 bg-primary/5 shadow-sm" 
                : "border-slate-50 hover:border-primary/20 hover:bg-slate-50/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-primary font-bold">
                <span className="text-xs leading-none">{apt.time.split(':')[0]}</span>
                <span className="text-[10px] opacity-60">AM</span>
              </div>
              <div>
                <h4 className="font-bold text-dark text-sm group-hover:text-primary transition-colors">
                  {apt.patientName || `Paciente #${apt.patientId}`}
                </h4>
                <p className="text-xs text-slate-500">{apt.type}</p>
              </div>
            </div>
            <span className={clsx(
              "text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
              getStatusStyles(apt.status)
            )}>
              {apt.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agenda;
