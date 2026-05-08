import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mockPatients, mockAppointments } from '../data/mockData';

export const useDentalStore = create(
  persist(
    (set) => ({
      patients: mockPatients.map(p => ({
        ...p,
        billingData: p.billingData || {
          rfc: '',
          razonSocial: '',
          cp: '',
          regimen: '601',
          usoCfdi: 'G03'
        }
      })),
      appointments: mockAppointments,
      selectedPatientId: null,
      activeView: 'inicio',
      isSidebarOpen: false,
      clinicProfile: {
        doctorName: 'Dra. Carmen López',
        specialty: 'Odontología General',
        clinicName: 'DentalPro',
        initials: 'CL',
        rfc: 'XAXX010101000',
        regimen: '612 - Personas Físicas con Actividades Profesionales',
        cp: '06700'
      },

      updateClinicProfile: (profile) => set((state) => ({
        clinicProfile: { ...state.clinicProfile, ...profile }
      })),
      
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setActiveView: (view) => set({ activeView: view, isSidebarOpen: false }),
      
      setSelectedPatient: (id) => set({ selectedPatientId: id }),

      addPatient: (newPatient) => set((state) => ({
        patients: [...state.patients, {
          ...newPatient,
          id: (Date.now()).toString(), 
          teeth: Array(32).fill(0).map((_, i) => ({ id: i + 1, status: 0 })),
          history: [],
          billingData: {
            rfc: '',
            razonSocial: '',
            cp: '',
            regimen: '601',
            usoCfdi: 'G03'
          }
        }]
      })),

      updatePatientBilling: (id, billingData) => set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, billingData } : p)
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
        { id: '1', patientId: '1', amount: 150, date: '2024-05-01', concept: 'Limpieza Profunda', status: 'Pagado', requiresInvoice: false },
        { id: '2', patientId: '2', amount: 450, date: '2024-04-28', concept: 'Tratamiento Conducto', status: 'Pendiente', requiresInvoice: true },
      ],

      addClinicalNote: (patientId, observation) => set((state) => ({
        patients: state.patients.map(p => {
          if (p.id === patientId) {
            return {
              ...p,
              history: [
                { date: new Date().toISOString().split('T')[0], observation },
                ...p.history
              ]
            };
          }
          return p;
        })
      })),

      addPayment: (payment) => set((state) => ({
        payments: [...state.payments, { 
          ...payment, 
          id: Date.now().toString(),
          invoiceNumber: payment.requiresInvoice ? `F-${Math.floor(1000 + Math.random() * 9000)}` : null,
          uuid: payment.requiresInvoice ? crypto.randomUUID() : null
        }]
      })),

      updateAppointmentStatus: (id, status) => set((state) => ({
        appointments: state.appointments.map(apt => apt.id === id ? { ...apt, status } : apt)
      })),
    }),
    {
      name: 'dental-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
