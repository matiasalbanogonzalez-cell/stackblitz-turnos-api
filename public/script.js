const API_BASE = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.user.role);
                    showMessage('Login exitoso', 'success');
                    setTimeout(() => {
                        if (data.user.role === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'dashboard.html';
                        }
                    }, 1000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('registerNombre').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const res = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    showMessage('Registro exitoso', 'success');
                    setTimeout(() => showTab('login'), 1000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        });
    }

    // Turno form
    const turnoForm = document.getElementById('turnoForm');
    if (turnoForm) {
        turnoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;
            const profesional = document.getElementById('profesional').value;
            const especialidad = document.getElementById('especialidad').value;
            const notas = document.getElementById('notas').value;

            try {
                const res = await fetch(`${API_BASE}/turnos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ fecha, hora, profesional, especialidad, notas })
                });
                const data = await res.json();
                if (res.ok) {
                    showMessage('Turno creado exitosamente', 'success');
                    turnoForm.reset();
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        });
    }

    // Load historial
    if (window.location.pathname.includes('dashboard.html')) {
        loadHistorial();
    }

    // Load turnos for admin
    if (window.location.pathname.includes('admin.html')) {
        loadTurnos();
    }
});

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}

function showMessage(message, type) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = message;
    msgDiv.className = type;
    setTimeout(() => msgDiv.textContent = '', 3000);
}

async function loadHistorial() {
    try {
        const res = await fetch(`${API_BASE}/turnos/historial`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const turnos = await res.json();
        const list = document.getElementById('turnosList');
        list.innerHTML = turnos.map(turno => `
            <div class="turno">
                <p><strong>Fecha:</strong> ${new Date(turno.fecha).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> ${turno.hora}</p>
                <p><strong>Profesional:</strong> ${turno.profesional}</p>
                <p><strong>Especialidad:</strong> ${turno.especialidad}</p>
                <p><strong>Estado:</strong> ${turno.estado}</p>
                ${turno.notas ? `<p><strong>Notas:</strong> ${turno.notas}</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        showMessage('Error al cargar historial', 'error');
    }
}

async function loadTurnos() {
    const especialidad = document.getElementById('filterEspecialidad')?.value || '';
    const profesional = document.getElementById('filterProfesional')?.value || '';
    const estado = document.getElementById('filterEstado')?.value || '';

    const query = new URLSearchParams({ especialidad, profesional, estado }).toString();

    try {
        const res = await fetch(`${API_BASE}/turnos?${query}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const turnos = await res.json();
        const list = document.getElementById('turnosList');
        list.innerHTML = turnos.map(turno => `
            <div class="turno">
                <p><strong>Paciente:</strong> ${turno.paciente.nombre} (${turno.paciente.email})</p>
                <p><strong>Fecha:</strong> ${new Date(turno.fecha).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> ${turno.hora}</p>
                <p><strong>Profesional:</strong> ${turno.profesional}</p>
                <p><strong>Especialidad:</strong> ${turno.especialidad}</p>
                <p><strong>Estado:</strong> <select onchange="changeEstado('${turno._id}', this.value)">
                    <option value="pendiente" ${turno.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="confirmado" ${turno.estado === 'confirmado' ? 'selected' : ''}>Confirmado</option>
                    <option value="cancelado" ${turno.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select></p>
                ${turno.notas ? `<p><strong>Notas:</strong> ${turno.notas}</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        showMessage('Error al cargar turnos', 'error');
    }
}

async function changeEstado(id, estado) {
    try {
        const res = await fetch(`${API_BASE}/turnos/${id}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ estado })
        });
        if (res.ok) {
            showMessage('Estado actualizado', 'success');
        } else {
            showMessage('Error al actualizar', 'error');
        }
    } catch (error) {
        showMessage('Error de conexión', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}