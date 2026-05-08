import { useState } from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { format, startOfToday, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const AgendaModule = () => {
  const { appointments, setSelectedPatient, setActiveView } = useDentalStore();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [currentMonth, setCurrentMonth] = useState(startOfToday());

  const days = eachDayOfInterval({
    start: startOfWeek(currentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(currentMonth, { weekStartsOn: 1 }),
  });

  const filteredAppointments = appointments.filter(apt => {
    // Para la demo, si no hay fecha real, mostramos algunas en "Hoy"
    if (!apt.date) return isSameDay(selectedDate, startOfToday());
    return isSameDay(new Date(apt.date), selectedDate);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Agenda de Citas</h2>
          <p className="text-slate-500 text-sm">Gestiona el tiempo de tu clínica</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20">
          <Plus size={18} />
          Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Picker */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-dark capitalize">{format(currentMonth, 'MMMM yyyy', { locale: es })}</h3>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={20}/></button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={20}/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map(d => (
                <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={clsx(
                    "h-10 w-full rounded-xl flex items-center justify-center text-sm transition-all",
                    isSameDay(day, selectedDate) ? "bg-primary text-white font-bold shadow-sm shadow-primary/30" : "hover:bg-slate-50 text-slate-600",
                    !isSameDay(day, currentMonth) && !isSameDay(day, selectedDate) && "text-slate-300"
                  )}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 text-primary mb-2">
              <Clock size={18} />
              <h4 className="font-bold text-sm">Resumen del Día</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tienes <span className="font-bold text-primary">{filteredAppointments.length} citas</span> programadas para el {format(selectedDate, "d 'de' MMMM", { locale: es })}.
            </p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-dark">
              Citas para el {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
            </h3>
          </div>

          <div className="space-y-3">
            {filteredAppointments.map((apt) => (
              <div 
                key={apt.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="text-center min-w-[60px] py-2 bg-slate-50 rounded-xl">
                    <p className="text-sm font-bold text-primary">{apt.time}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Hora</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-dark group-hover:text-primary transition-colors">{apt.patientName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Plus size={12} className="text-primary" /> {apt.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={clsx(
                    "text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider",
                    apt.status === 'Completado' ? "bg-emerald-50 text-emerald-600" : (apt.status === 'En espera' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-600")
                  )}>
                    {apt.status}
                  </span>
                  <button 
                    onClick={() => {
                      if (apt.patientId) {
                        setSelectedPatient(apt.patientId);
                        setActiveView('pacientes');
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  >
                    <User size={18} />
                  </button>
                </div>
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <CalendarIcon size={32} />
                </div>
                <p className="text-slate-400 font-medium">No hay citas para este día.</p>
                <button className="text-primary text-sm font-bold mt-2 hover:underline">+ Agendar una cita</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaModule;
