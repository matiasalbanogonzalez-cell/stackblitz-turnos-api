# API de Turnos Médicos

Aplicación segura y modular para la gestión de turnos médicos utilizando Node.js, Express y MongoDB.

## Características

- **Autenticación JWT** con roles (admin, cliente)
- **Gestión de Usuarios**: Registro, login, hash de contraseñas
- **Gestión de Turnos**: CRUD completo con validaciones
- **Control de Acceso**: Middlewares para proteger rutas según rol
- **Testing**: Pruebas unitarias con Jest

## Instalación

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura variables de entorno en `.env`
4. Ejecuta: `npm start`

## Uso

### Endpoints de Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Endpoints de Turnos

- `POST /api/turnos` - Crear turno (cliente)
- `GET /api/turnos/historial` - Ver historial (cliente)
- `GET /api/turnos` - Consultar turnos (admin, con filtros)
- `PATCH /api/turnos/:id/estado` - Modificar estado (admin)
- `PUT /api/turnos/:id` - Actualizar turno (admin)
- `DELETE /api/turnos/:id` - Eliminar turno (admin)

## Testing

Ejecuta `npm test` para correr las pruebas.