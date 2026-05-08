import { useState } from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { MessageSquare, Plus, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ClinicalNotes = () => {
  const { patients, selectedPatientId, addClinicalNote } = useDentalStore();
  const [newNote, setNewNote] = useState('');
  const patient = patients.find(p => p.id === selectedPatientId);

  if (!patient) return null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) {
      toast.error('La nota no puede estar vacía');
      return;
    }

    addClinicalNote(patient.id, newNote);
    setNewNote('');
    toast.success('Nota clínica agregada');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-dark flex items-center gap-2">
            <FileText className="text-primary" size={24} />
            Evolución Clínica
          </h3>
          <p className="text-sm text-slate-500">Registro cronológico de observaciones y tratamientos</p>
        </div>
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="space-y-4">
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <textarea 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nueva observación clínica aquí..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-dark transition-all min-h-[120px] resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
          >
            <Plus size={18} />
            Agregar Nota
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-6 mt-10">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} />
          Historial de Notas
        </h4>
        
        <div className="space-y-4">
          {patient.history.map((note, index) => (
            <div key={index} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  {note.date}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed group-hover:text-dark transition-colors">
                {note.observation}
              </p>
            </div>
          ))}
          
          {patient.history.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-slate-400 text-sm italic">No hay notas clínicas registradas aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotes;
