import { useState, useEffect } from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { Save, User, Phone, Mail, Calendar, Info } from 'lucide-react';
import { toast } from 'sonner';

const PatientForm = () => {
  const { patients, selectedPatientId, addPatient } = useDentalStore();
  const patient = patients.find(p => p.id === selectedPatientId);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'M',
    phone: '',
    email: '',
    status: 'Activo'
  });

  useEffect(() => {
    if (patient && selectedPatientId !== 'new') {
      setFormData({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        status: patient.status
      });
    } else if (selectedPatientId === 'new') {
      setFormData({
        name: '',
        age: '',
        gender: 'M',
        phone: '',
        email: '',
        status: 'Activo'
      });
    }
  }, [patient, selectedPatientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPatientId === 'new') {
      addPatient(formData);
      toast.success('Paciente registrado correctamente');
    } else {
      toast.info('Funcionalidad de edición no implementada');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-bold text-dark text-xl">Historia Clínica</h2>
          <p className="text-sm text-slate-500">Información detallada del paciente</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Save size={18} />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <form className="space-y-8">
        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
            <User size={16} />
            Datos Personales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Nombre Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                placeholder="Ej. Juan Pérez"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Edad</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Género</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all appearance-none"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
            <Phone size={16} />
            Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                  placeholder="Ej. 555-0123"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                  placeholder="juan@email.com"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
            <Info size={16} />
            Estado de Cuenta
          </h3>
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-primary">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-dark">Última Visita</p>
                <p className="text-xs text-slate-500">{patient?.lastVisit || 'N/A'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-dark">Saldo Pendiente</p>
              <p className="text-lg font-bold text-emerald-600">$0.00</p>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default PatientForm;
