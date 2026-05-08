import { Users, DollarSign, CheckCircle2, Clock } from 'lucide-react';

const KPICards = () => {
  const kpis = [
    { label: 'Pacientes Hoy', value: '12', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Ingresos', value: '$1,250', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Asistencia', value: '92%', icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Pendientes', value: '5', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={kpi.color} size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">{kpi.label}</h3>
          <p className="text-2xl font-bold text-dark mt-1">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
