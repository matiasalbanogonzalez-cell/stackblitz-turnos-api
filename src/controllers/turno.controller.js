import Turno from '../models/Turno.js';

// Crear turno (paciente)
export const crearTurno = async (req, res) => {
  try {
    const { fecha, hora, profesional, especialidad, notas } = req.body;
    const paciente = req.user.id; // del token

    const nuevoTurno = new Turno({
      fecha,
      hora,
      profesional,
      paciente,
      especialidad,
      notas,
    });

    await nuevoTurno.save();
    res.status(201).json({ message: 'Turno creado exitosamente', turno: nuevoTurno });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ver historial de turnos (paciente)
export const verHistorial = async (req, res) => {
  try {
    const turnos = await Turno.find({ paciente: req.user.id }).populate('paciente', 'nombre email');
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Consultar todos los turnos (admin)
export const consultarTodosTurnos = async (req, res) => {
  try {
    const { especialidad, profesional, estado } = req.query;
    let filtro = {};

    if (especialidad) filtro.especialidad = especialidad;
    if (profesional) filtro.profesional = profesional;
    if (estado) filtro.estado = estado;

    const turnos = await Turno.find(filtro).populate('paciente', 'nombre email');
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modificar estado de turno (admin)
export const modificarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const turno = await Turno.findByIdAndUpdate(id, { estado }, { new: true });
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Estado actualizado', turno });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar turno (opcional, para paciente o admin)
export const actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const turno = await Turno.findByIdAndUpdate(id, updates, { new: true });
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Turno actualizado', turno });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar turno (admin)
export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;

    const turno = await Turno.findByIdAndDelete(id);
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Turno eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};