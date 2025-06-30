// Obtenemos los elementos del DOM
const loginBox = document.getElementById('loginBox');
const loginForm = document.getElementById('loginForm');

let isExpanded = false;

// Expande el formulario al hacer clic en "Iniciar Sesión"
loginBox.addEventListener('click', () => {
    if (!isExpanded) {
        loginForm.style.display = 'block';
        isExpanded = true;
    }
});

// Mostrar u ocultar la contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const iconEye = document.getElementById('icon-eye');

togglePassword.addEventListener('click', (event) => {
    event.stopPropagation();

    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    // Cambia el ícono entre ojo abierto y cerrado
    iconEye.classList.toggle('bi-eye');
    iconEye.classList.toggle('bi-eye-slash');
});

// Manejar envío del formulario
loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío por defecto

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación básica
    if (!username || !password) {
        alert("Por favor, ingresa tu correo y contraseña.");
        return;
    }

    // Enviar datos a la API de Flask
    fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            correo_electronico: username,
            contrasena: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);

        if (data.usuario) {
            alert("Inicio de sesión exitoso");
            window.location.href = "/dashboard"; // Redirige a dashboard
        } else {
            alert("Credenciales incorrectas");
        }
    })
    .catch(error => {
        console.error('Error durante el inicio de sesión:', error);
        alert("Ocurrió un error al intentar iniciar sesión.");
    });
});