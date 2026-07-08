import { CategoryId } from '../domain/models/category.model';
import { Task } from '../domain/models/task.model';

const DAY = 86_400_000;

export const TEST_TASKS: Task[] = [
  {
    id: 'test-001',
    title: 'Comprar leche y pan',
    completed: false,
    categoryId: CategoryId.Shopping,
    createdAt: Date.now() - DAY * 1,
  },
  {
    id: 'test-002',
    title: 'Preparar presentación del proyecto',
    completed: false,
    categoryId: CategoryId.Work,
    createdAt: Date.now() - DAY * 2,
  },
  {
    id: 'test-003',
    title: 'Llamar al dentista',
    completed: true,
    categoryId: CategoryId.Personal,
    createdAt: Date.now() - DAY * 3,
  },
  {
    id: 'test-004',
    title: 'Revisar correos pendientes',
    completed: false,
    categoryId: CategoryId.Work,
    createdAt: Date.now() - DAY * 4,
  },
  {
    id: 'test-005',
    title: 'Ir al gimnasio',
    completed: true,
    categoryId: CategoryId.Personal,
    createdAt: Date.now() - DAY * 5,
  },
  {
    id: 'test-006',
    title: 'Comprar regalo de cumpleaños',
    completed: false,
    categoryId: CategoryId.Shopping,
    createdAt: Date.now() - DAY * 6,
  },
  {
    id: 'test-007',
    title: 'Actualizar documentación técnica',
    completed: false,
    categoryId: CategoryId.Work,
    createdAt: Date.now() - DAY * 7,
  },
  {
    id: 'test-008',
    title: 'Leer 30 minutos antes de dormir',
    completed: true,
    categoryId: CategoryId.Personal,
    createdAt: Date.now() - DAY * 8,
  },
  {
    id: 'test-009',
    title: 'Pagar factura de internet',
    completed: false,
    categoryId: CategoryId.Personal,
    createdAt: Date.now() - DAY * 9,
  },
  {
    id: 'test-010',
    title: 'Organizar escritorio',
    completed: true,
    categoryId: CategoryId.Work,
    createdAt: Date.now() - DAY * 10,
  },
  {
    id: 'test-011',
    title: 'Comprar frutas y verduras',
    completed: false,
    categoryId: CategoryId.Shopping,
    createdAt: Date.now() - DAY * 11,
  },
  {
    id: 'test-012',
    title: 'Planificar menú de la semana',
    completed: false,
    categoryId: CategoryId.Personal,
    createdAt: Date.now() - DAY * 12,
  },
];
