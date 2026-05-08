import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mockPatients, mockAppointments } from '../data/mockData';

export const useDentalStore = create(
  persist(
    (set) => ({
      patients: mockPatients,
      appointments: mockAppointments,
      selectedPatientId: null,
      activeView: 'inicio',

      setActiveView: (view) => set({ activeView: view }),
      
      setSelectedPatient: (id) => set({ selectedPatientId: id }),

      addPatient: (newPatient) => set((state) => ({
        patients: [...state.patients, {
          ...newPatient,
          id: (Date.now()).toString(), // Use timestamp for unique ID
          teeth: Array(32).fill(0).map((_, i) => ({ id: i + 1, status: 0 })),
          history: []
        }]
      })),

      updateToothStatus: (patientId, toothId) => set((state) => ({
        patients: state.patients.map(p => {
          if (p.id === patientId) {
            return {
              ...p,
              teeth: p.teeth.map(t => {
                if (t.id === toothId) {
                  return { ...t, status: (t.status + 1) % 3 };
                }
                return t;
              })
            };
          }
          return p;
        })
      })),
    payments: [
      { id: '1', patientId: '1', amount: 150, date: '2024-05-01', concept: 'Limpieza Profunda', status: 'Pagado' },
      { id: '2', patientId: '2', amount: 450, date: '2024-04-28', concept: 'Tratamiento Conducto', status: 'Pendiente' },
    ],

    addPayment: (payment) => set((state) => ({
      payments: [...state.payments, { ...payment, id: Date.now().toString() }]
    })),

    updateAppointmentStatus: (id, status) => set((state) => ({
      appointments: state.appointments.map(apt => apt.id === id ? { ...apt, status } : apt)
    })),
    }),
    {
    name: 'dental-storage',
 // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
