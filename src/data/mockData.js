export const mockPatients = [
  {
    id: '1',
    name: 'Juan Pérez',
    age: 34,
    gender: 'M',
    phone: '555-0123',
    email: 'juan.perez@email.com',
    lastVisit: '2024-05-01',
    status: 'Activo',
    teeth: Array(32).fill(0).map((_, i) => ({ id: i + 1, status: i === 5 ? 1 : (i === 12 ? 2 : 0) })),
    history: [
      { date: '2024-05-01', observation: 'Limpieza dental profunda realizada. Paciente reporta sensibilidad en cuadrante superior.' },
      { date: '2024-04-15', observation: 'Consulta inicial. Se detecta caries incipiente en pieza 6.' }
    ]
  },
  {
    id: '2',
    name: 'María García',
    age: 28,
    gender: 'F',
    phone: '555-0124',
    email: 'm.garcia@email.com',
    lastVisit: '2024-04-28',
    status: 'Pendiente',
    teeth: Array(32).fill(0).map((_, i) => ({ id: i + 1, status: i === 10 ? 2 : (i === 18 ? 1 : 0) })),
    history: [
      { date: '2024-04-28', observation: 'Tratamiento de conducto en pieza 11 completado con éxito.' },
      { date: '2024-04-10', observation: 'Evaluación de ortodoncia recomendada.' }
    ]
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    age: 45,
    gender: 'M',
    phone: '555-0125',
    email: 'crodriguez@email.com',
    lastVisit: '2024-05-05',
    status: 'Activo',
    teeth: Array(32).fill(0).map((_, i) => ({ id: i + 1, status: 0 })),
    history: [
      { date: '2024-05-05', observation: 'Extracción de cordales superiores sin complicaciones.' }
    ]
  },
  {
    id: '4',
    name: 'Ana López',
    age: 22,
    gender: 'F',
    phone: '555-0987',
    email: 'ana.lopez@example.com',
    lastVisit: '2024-05-06',
    status: 'Activo',
    teeth: Array(32).fill(0).map((_, i) => ({ id: i + 1, status: i < 5 ? 2 : 0 })),
    history: [
      { date: '2024-05-06', observation: 'Ajuste de brackets mensual. Higiene excelente.' }
    ]
  },
  {
    id: '5',
    name: 'Roberto Sánchez',
    age: 56,
    gender: 'M',
    phone: '555-6677',
    email: 'rsanchez@clinic.com',
    lastVisit: '2024-04-20',
    status: 'Inactivo',
    teeth: Array(32).fill(0).map((_, i) => ({ id: i + 1, status: i > 25 ? 1 : 0 })),
    history: [
      { date: '2024-04-20', observation: 'Se presupuesta prótesis parcial para arco inferior.' }
    ]
  }
];

export const mockAppointments = [
  { id: '1', patientId: '1', patientName: 'Juan Pérez', time: '09:00', type: 'Limpieza', status: 'Completado' },
  { id: '2', patientId: '2', patientName: 'María García', time: '10:30', type: 'Revisión', status: 'En espera' },
  { id: '3', patientId: '3', patientName: 'Carlos Rodríguez', time: '12:00', type: 'Extracción', status: 'Pendiente' },
  { id: '4', patientId: '4', patientName: 'Ana López', time: '14:30', type: 'Ortodoncia', status: 'Pendiente' },
  { id: '5', patientId: '5', patientName: 'Roberto Sánchez', time: '16:00', type: 'Consulta General', status: 'Pendiente' },
];
