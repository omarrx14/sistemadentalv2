import { useState } from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, X, Save } from 'lucide-react';
import { useDentalStore } from '../../store/useDentalStore';
import { clsx } from 'clsx';
import { toast } from 'sonner';

const FinanceModule = () => {
  const { payments, patients, addPayment } = useDentalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    concept: '',
    status: 'Pagado',
    date: new Date().toISOString().split('T')[0]
  });

  const totalEarnings = payments
    .filter(p => p.status === 'Pagado')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingCollection = payments
    .filter(p => p.status === 'Pendiente')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.amount || !formData.concept) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    addPayment({
      ...formData,
      amount: Number(formData.amount)
    });

    toast.success('Pago registrado correctamente');
    setIsModalOpen(false);
    setFormData({
      patientId: '',
      amount: '',
      concept: '',
      status: 'Pagado',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Módulo de Finanzas</h2>
          <p className="text-slate-500 text-sm">Control de ingresos y pagos de la clínica</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20"
        >
          <DollarSign size={18} />
          Registrar Pago
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <ArrowUpRight size={12} /> +15%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Ingresos Totales</p>
          <p className="text-2xl font-bold text-dark mt-1">${totalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <CreditCard size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Pendiente por Cobrar</p>
          <p className="text-2xl font-bold text-dark mt-1">${pendingCollection.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <ArrowDownRight size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Gastos Mensuales</p>
          <p className="text-2xl font-bold text-dark mt-1">$0.00</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-dark">Transacciones Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paciente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concepto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.slice().reverse().map((p) => {
                const patient = patients.find(pat => pat.id === p.patientId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-dark">{patient?.name || 'Desconocido'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.concept}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-dark">${Number(p.amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        p.status === 'Pagado' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-dark text-lg">Nuevo Registro de Pago</h3>
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
                  <label className="text-xs font-bold text-slate-500 ml-1">Monto ($)</label>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Estado</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all appearance-none"
                  >
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Concepto</label>
                <input 
                  type="text" 
                  value={formData.concept}
                  onChange={(e) => setFormData({...formData, concept: e.target.value})}
                  placeholder="Ej. Limpieza dental"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-4"
              >
                <Save size={20} />
                Guardar Pago
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
