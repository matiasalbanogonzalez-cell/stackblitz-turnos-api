import mongoose from 'mongoose';

const turnoSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    profesional: {
      type: String,
      required: true,
    },
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    especialidad: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmado', 'cancelado'],
      default: 'pendiente',
    },
    notas: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Turno', turnoSchema);