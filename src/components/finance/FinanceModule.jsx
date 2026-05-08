import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { useDentalStore } from '../../store/useDentalStore';
import { clsx } from 'clsx';

const FinanceModule = () => {
  const { payments, patients } = useDentalStore();

  const totalEarnings = payments
    .filter(p => p.status === 'Pagado')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCollection = payments
    .filter(p => p.status === 'Pendiente')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Módulo de Finanzas</h2>
          <p className="text-slate-500 text-sm">Control de ingresos y pagos de la clínica</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
          <DollarSign size={18} />
          Registrar Pago
        </button>
      </div>

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

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-dark">Transacciones Recientes</h3>
        </div>
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
            {payments.map((p) => {
              const patient = patients.find(pat => pat.id === p.patientId);
              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-dark">{patient?.name || 'Desconocido'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.concept}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-dark">${p.amount}</td>
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
  );
};

export default FinanceModule;
