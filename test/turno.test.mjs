import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Turno from '../src/models/Turno.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Turno.deleteMany({});

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = new User({
    nombre: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    role: 'cliente'
  });
  await user.save();
  userId = user._id;

  // Generar token
  token = jwt.sign({ id: userId, role: 'cliente' }, process.env.JWT_SECRET);
});

describe('Turno API', () => {
  it('should create a turno', async () => {
    const res = await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fecha: '2024-12-31',
        hora: '10:00',
        profesional: 'Dr. Smith',
        especialidad: 'Cardiología',
        notas: 'Consulta rutinaria'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Turno creado exitosamente');
  });

  it('should get historial for user', async () => {
    // Crear turno primero
    const turno = new Turno({
      fecha: new Date('2024-12-31'),
      hora: '10:00',
      profesional: 'Dr. Smith',
      paciente: userId,
      especialidad: 'Cardiología'
    });
    await turno.save();

    const res = await request(app)
      .get('/api/turnos/historial')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
  });
});