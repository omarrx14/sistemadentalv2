import { useState } from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, Plus, X, Save, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format, startOfToday, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const AgendaModule = () => {
  const { appointments, patients, setSelectedPatient, setActiveView, addAppointment, updateAppointmentStatus } = useDentalStore();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: '',
    time: '09:00',
    type: 'Consulta General',
    date: format(startOfToday(), 'yyyy-MM-dd')
  });

  const days = eachDayOfInterval({
    start: startOfWeek(currentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(currentMonth, { weekStartsOn: 1 }),
  });

  const filteredAppointments = appointments.filter(apt => {
    // Si la cita no tiene fecha (mock inicial), la mostramos solo en "Hoy"
    if (!apt.date) return isSameDay(selectedDate, startOfToday());
    return isSameDay(parseISO(apt.date), selectedDate);
  }).sort((a, b) => a.time.localeCompare(b.time));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.time || !formData.date) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const patient = patients.find(p => p.id === formData.patientId);
    
    addAppointment({
      ...formData,
      patientName: patient?.name || 'Paciente Desconocido'
    });

    toast.success('Cita agendada correctamente');
    setIsModalOpen(false);
    setFormData({
      patientId: '',
      time: '09:00',
      type: 'Consulta General',
      date: format(selectedDate, 'yyyy-MM-dd')
    });
  };

  const handleStatusChange = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pendiente' ? 'En espera' : (currentStatus === 'En espera' ? 'Completado' : 'Pendiente');
    updateAppointmentStatus(id, nextStatus);
    toast.info(`Estado de cita actualizado a: ${nextStatus}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Agenda de Citas</h2>
          <p className="text-slate-500 text-sm">Gestiona el tiempo de tu clínica</p>
        </div>
        <button 
          onClick={() => {
            setFormData(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20"
        >
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
              {days.map((day, idx) => {
                const hasAppointments = appointments.some(apt => apt.date && isSameDay(parseISO(apt.date), day));
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={clsx(
                      "h-10 w-full rounded-xl flex flex-col items-center justify-center text-sm transition-all relative",
                      isSameDay(day, selectedDate) ? "bg-primary text-white font-bold shadow-sm shadow-primary/30" : "hover:bg-slate-50 text-slate-600",
                      !isSameDay(day, currentMonth) && !isSameDay(day, selectedDate) && "text-slate-300"
                    )}
                  >
                    {format(day, 'd')}
                    {hasAppointments && !isSameDay(day, selectedDate) && (
                      <div className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </button>
                );
              })}
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
                  <button 
                    onClick={() => handleStatusChange(apt.id, apt.status)}
                    className={clsx(
                      "text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all",
                      apt.status === 'Completado' ? "bg-emerald-50 text-emerald-600" : (apt.status === 'En espera' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-600")
                    )}
                  >
                    {apt.status}
                  </button>
                  <button 
                    onClick={() => {
                      if (apt.patientId) {
                        setSelectedPatient(apt.patientId);
                        setActiveView('pacientes');
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    title="Ver Expediente"
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
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary text-sm font-bold mt-2 hover:underline"
                >
                  + Agendar una cita
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-dark text-lg flex items-center gap-2">
                <CalendarIcon className="text-primary" size={20} />
                Agendar Nueva Cita
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Paciente</label>
                <select 
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all appearance-none"
                >
                  <option value="">Seleccionar paciente...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Fecha</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Hora</label>
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Tipo de Tratamiento</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all appearance-none"
                >
                  <option value="Consulta General">Consulta General</option>
                  <option value="Limpieza">Limpieza Dental</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Extracción">Extracción</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Urgencia">Urgencia</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-4"
              >
                <CheckCircle2 size={20} />
                Confirmar Cita
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaModule;
