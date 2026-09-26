export const CONSULTAS = [
  {
    id: 1,
    data: '2025-03-14',
    hora: '09:00',
    duracao: 30,
    animalNome: 'Thor',
    tutorNome: 'João Silva',
    especie: 'Cão',
    tipo: 'Consulta',
    status: 'Agendada',
  },
  {
    id: 2,
    data: '2025-03-14',
    hora: '10:30',
    duracao: 30,
    animalNome: 'Mel',
    tutorNome: 'Maria Santos',
    especie: 'Gato',
    tipo: 'Retorno',
    status: 'Em atendimento',
  },
  {
    id: 3,
    data: '2025-03-14',
    hora: '14:00',
    duracao: 30,
    animalNome: 'Nina',
    tutorNome: 'Carlos Oliveira',
    especie: 'Cão',
    tipo: 'Vacinação',
    status: 'Confirmada',
  },
]

export const VACINAS = [
  {
    id: 1,
    animalNome: 'Max',
    vacina: 'Vacina antirrábica',
    status: 'Atrasada',
  },
  {
    id: 2,
    animalNome: 'Luna',
    vacina: 'Vacina múltipla',
    status: 'Próxima',
  },
]

export const ANIMAIS = [
  {
    id: 1,
    nome: 'Max',
    tutorNome: 'João Silva',
    alerta: 'Animal possui alergia a determinado medicamento.',
  },
]