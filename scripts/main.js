// Obtener elementos del DOM
const loginBox = document.getElementById('loginBox');
const loginForm = document.getElementById('loginForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const iconEye = document.getElementById('icon-eye');
const briefcase = document.querySelector('.briefcase-img');

let isExpanded = false;

// Mostrar formulario al hacer clic en login box
loginBox.addEventListener('click', () => {
    if (!isExpanded) {
        loginForm.style.display = 'block';
        isExpanded = true;
    }
});

// Alternar visibilidad de contraseña
togglePassword.addEventListener('click', (event) => {
    event.stopPropagation();
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    iconEye.classList.toggle('bi-eye');
    iconEye.classList.toggle('bi-eye-slash');
});

// Mostrar el maletín después de 3 segundos
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        briefcase.classList.remove('hidden');
    }, 3000);
});

// Enviar datos al backend
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Por favor, ingresa tu correo y contraseña.");
        return;
    }

    fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            correo_electronico: username,
            contrasena: password
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        if (data.usuario) {
            alert("Inicio de sesión exitoso");
            window.location.href = "/dashboard";
        } else {
            alert("Credenciales incorrectas");
        }
    })
    .catch(error => {
        console.error('Error durante el inicio de sesión:', error);
        alert("Ocurrió un error al intentar iniciar sesión.");
    });
});
