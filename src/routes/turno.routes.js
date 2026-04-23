import { Router } from 'express';
import {
  crearTurno,
  verHistorial,
  consultarTodosTurnos,
  modificarEstado,
  actualizarTurno,
  eliminarTurno,
} from '../controllers/turno.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();

// Crear turno (cliente autenticado)
router.post('/', verifyToken, checkRole(['cliente']), crearTurno);

// Ver historial de turnos (cliente)
router.get('/historial', verifyToken, checkRole(['cliente']), verHistorial);

// Consultar todos los turnos (admin, con filtros)
router.get('/', verifyToken, checkRole(['admin']), consultarTodosTurnos);

// Modificar estado (admin)
router.patch('/:id/estado', verifyToken, checkRole(['admin']), modificarEstado);

// Actualizar turno (admin)
router.put('/:id', verifyToken, checkRole(['admin']), actualizarTurno);

// Eliminar turno (admin)
router.delete('/:id', verifyToken, checkRole(['admin']), eliminarTurno);

export default router;