import { useState } from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, X, Save, FileText, Printer, Building2, User } from 'lucide-react';
import { useDentalStore } from '../../store/useDentalStore';
import { clsx } from 'clsx';
import { toast } from 'sonner';

const FinanceModule = () => {
  const { payments, patients, addPayment, clinicProfile } = useDentalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    concept: '',
    status: 'Pagado',
    requiresInvoice: false,
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

    toast.success(formData.requiresInvoice ? 'Pago registrado y factura generada' : 'Pago registrado correctamente');
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      amount: '',
      concept: '',
      status: 'Pagado',
      requiresInvoice: false,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const InvoiceViewer = ({ payment, onClose }) => {
    const patient = patients.find(p => p.id === payment.patientId);
    const subtotal = Number(payment.amount) / 1.16;
    const iva = Number(payment.amount) - subtotal;

    return (
      <div className="fixed inset-0 bg-dark/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300">
          <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-dark">Vista Previa de Factura CFDI 4.0</h3>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm">
                <Printer size={18} /> Imprimir
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-12 space-y-12">
            {/* Header Factura */}
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {clinicProfile.initials}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-dark uppercase">{clinicProfile.clinicName}</h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest">SERVICIOS ODONTOLÓGICOS</p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                  <p className="font-bold text-dark">EMISOR:</p>
                  <p>{clinicProfile.doctorName}</p>
                  <p>RFC: {clinicProfile.rfc}</p>
                  <p>Régimen: {clinicProfile.regimen}</p>
                  <p>CP: {clinicProfile.cp}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-primary font-black text-2xl">FACTURA</p>
                <p className="text-slate-500 font-bold text-sm">{payment.invoiceNumber}</p>
                <p className="text-[10px] text-slate-400">FECHA: {payment.date}</p>
                <div className="mt-4 p-2 bg-slate-50 rounded-lg text-[9px] text-slate-400 font-mono text-right">
                  <p className="font-bold text-slate-500">UUID (Folio Fiscal):</p>
                  <p>{payment.uuid || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Receptor */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Datos del Receptor</p>
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-dark">{patient?.billingData?.razonSocial || patient?.name}</p>
                  <p className="text-slate-500">RFC: {patient?.billingData?.rfc || 'XAXX010101000'}</p>
                  <p className="text-slate-500">CP Fiscal: {patient?.billingData?.cp || '00000'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500">Uso CFDI: {patient?.billingData?.usoCfdi || 'G03 - Gastos en general'}</p>
                  <p className="text-slate-500">Régimen: {patient?.billingData?.regimen || '601 - General de Ley'}</p>
                </div>
              </div>
            </div>

            {/* Conceptos */}
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 font-bold text-slate-400 uppercase">Clave SAT</th>
                  <th className="py-4 font-bold text-slate-400 uppercase">Concepto</th>
                  <th className="py-4 font-bold text-slate-400 uppercase text-right">Precio Unit.</th>
                  <th className="py-4 font-bold text-slate-400 uppercase text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-6 text-slate-500">85121600</td>
                  <td className="py-6 font-bold text-dark">{payment.concept}</td>
                  <td className="py-6 text-right text-dark">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-6 text-right font-bold text-dark">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              </tbody>
            </table>

            {/* Totales */}
            <div className="flex justify-end pt-8">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-bold text-dark">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">IVA (16%):</span>
                  <span className="font-bold text-dark">${iva.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-slate-200">
                  <span className="font-black text-dark">TOTAL:</span>
                  <span className="font-black text-primary">${Number(payment.amount).toLocaleString(undefined, {minimumFractionDigits: 2})} MXN</span>
                </div>
              </div>
            </div>

            {/* Sello Digital Mock */}
            <div className="pt-12 grid grid-cols-4 gap-8">
              <div className="col-span-1">
                <div className="w-32 h-32 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 text-center p-4">
                  QR CODE DIGITAL SAT MOCK
                </div>
              </div>
              <div className="col-span-3 space-y-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Sello Digital del CFDI</p>
                  <p className="text-[7px] text-slate-400 font-mono break-all leading-tight">
                    iVBORw0KGgoAAAANSUhEUgAAAJAAAABkCAYAAACpfc0DAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QgKDRYw...
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Sello Digital del SAT</p>
                  <p className="text-[7px] text-slate-400 font-mono break-all leading-tight">
                    MIIEpAIBAAKCAQEA1uU5Y2vXzW4Q3o6q9Z1pZ6Y9J8G9X6O8z2k5Y2vXzW4Q3o6q9Z1pZ6Y9J8G9X6O8z2k5Y2vXzW4Q3o6q9Z1pZ6Y9J8G9X6O8z2k5Y2vXzW4Q3o6q9Z1pZ6Y9J8G9X6O8z2k...
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-slate-50 text-center border-t border-slate-100">
            <p className="text-[10px] text-slate-400">Este documento es una representación impresa de un CFDI v4.0 con fines demostrativos.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Módulo de Finanzas</h2>
          <p className="text-slate-500 text-sm">Ingresos, pagos y facturación CFDI 4.0</p>
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
          <p className="text-slate-500 text-sm font-medium">Ingresos Totales (Neto)</p>
          <p className="text-2xl font-bold text-dark mt-1">${totalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <CreditCard size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">IVA por Pagar</p>
          <p className="text-2xl font-bold text-dark mt-1">${(totalEarnings * 0.16).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <ArrowDownRight size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Pendiente por Cobrar</p>
          <p className="text-2xl font-bold text-dark mt-1">${pendingCollection.toLocaleString()}</p>
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
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Monto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Factura</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.slice().reverse().map((p) => {
                const patient = patients.find(pat => pat.id === p.patientId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-300" />
                        <span className="text-sm font-medium text-dark">{patient?.name || 'Desconocido'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.concept}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-dark text-right">${Number(p.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      {p.requiresInvoice ? (
                        <button 
                          onClick={() => setSelectedInvoice(p)}
                          className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg hover:bg-primary hover:text-white transition-all uppercase"
                        >
                          {p.invoiceNumber}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 italic">No requerida</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
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

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <InvoiceViewer 
          payment={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}

      {/* Register Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-dark text-lg">Registro de Cobro</h3>
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
                  <label className="text-xs font-bold text-slate-500 ml-1">Monto Total ($)</label>
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
                  placeholder="Ej. Tratamiento de Ortodoncia"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer" onClick={() => setFormData({...formData, requiresInvoice: !formData.requiresInvoice})}>
                <div className={clsx(
                  "w-10 h-6 rounded-full relative transition-colors duration-200",
                  formData.requiresInvoice ? "bg-primary" : "bg-slate-200"
                )}>
                  <div className={clsx(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200",
                    formData.requiresInvoice ? "left-5" : "left-1"
                  )}></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-dark italic flex items-center gap-1">
                    <Building2 size={12} className="text-primary" /> Generar Factura CFDI 4.0
                  </p>
                  <p className="text-[10px] text-slate-500">Cálculo de IVA (16%) incluido</p>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-2"
              >
                <Save size={20} />
                Finalizar Cobro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
