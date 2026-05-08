import { useDentalStore } from './store/useDentalStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import KPICards from './components/dashboard/KPICards';
import Agenda from './components/dashboard/Agenda';
import Odontogram from './components/dashboard/Odontogram';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import PatientTable from './components/patients/PatientTable';
import ClinicalNotes from './components/patients/ClinicalNotes';
import FinanceModule from './components/finance/FinanceModule';
import SettingsModule from './components/settings/SettingsModule';
import AgendaModule from './components/agenda/AgendaModule';
import { Toaster } from 'sonner';

function App() {
  const { activeView, selectedPatientId, setSelectedPatient } = useDentalStore();

  const renderContent = () => {
    switch (activeView) {
      case 'inicio':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <KPICards />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-22rem)]">
              <div className="lg:col-span-4 h-full overflow-y-auto">
                <Agenda />
              </div>
              <div className="lg:col-span-8 h-full">
                <Odontogram />
              </div>
            </div>
          </div>
        );
      case 'pacientes':
        return selectedPatientId ? (
          <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
            <button 
              onClick={() => setSelectedPatient(null)}
              className="flex items-center gap-2 text-primary font-bold text-sm hover:underline mb-2"
            >
              ← Volver al listado
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <PatientList />
              </div>
              <div className="lg:col-span-8">
                <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-2 space-y-8">
                  <PatientForm />
                  <ClinicalNotes />
                  <Odontogram />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PatientTable />
        );
      case 'odontograma':
        return (
          <div className="h-[calc(100vh-12rem)] animate-in fade-in duration-500">
            <Odontogram />
          </div>
        );
      case 'agenda':
        return <AgendaModule />;
      case 'finanzas':
        return <FinanceModule />;
      case 'configuracion':
        return <SettingsModule />;
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-dark">
      <Toaster position="top-right" richColors />
      <Sidebar />
      
      <main className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        
        <div className="p-8 flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
