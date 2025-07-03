// scripts/usuarios.js

const API_URL = "http://127.0.0.1:5000/api/usuarios/";

const tablaUsuarios = document.getElementById("tablaUsuarios");
const formUsuario = document.getElementById("formUsuario");
const modalUsuario = new bootstrap.Modal(document.getElementById("modalUsuario"));
const modalTitle = document.getElementById("modalUsuarioLabel");
const passwordGroup = document.getElementById("passwordGroup");

let usuarios = [];

// =======================
// Cargar usuarios activos
// =======================
function cargarUsuarios() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      usuarios = data;
      renderTablaUsuarios();
    })
    .catch(err => {
      console.error("Error al cargar usuarios:", err);
      tablaUsuarios.innerHTML = `<tr><td colspan="6" class="text-danger">Error al cargar usuarios</td></tr>`;
    });
}

// =======================
// Pintar la tabla
// =======================
function renderTablaUsuarios() {
  tablaUsuarios.innerHTML = "";

  usuarios.forEach(usuario => {
    const estadoTexto = usuario.estado === 1 || usuario.estado === true
      ? '<span class="badge bg-success">Activo</span>'
      : '<span class="badge bg-danger">Inactivo</span>';

    const acciones = usuario.estado === 1 || usuario.estado === true
      ? `<button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${usuario.id_usuario})"><i class="bi bi-pencil-square"></i></button>
         <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${usuario.id_usuario})"><i class="bi bi-trash"></i></button>`
      : `<button class="btn btn-sm btn-info" onclick="restaurarUsuario(${usuario.id_usuario})"><i class="bi bi-arrow-counterclockwise"></i></button>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${usuario.id_usuario}</td>
      <td>${usuario.nombre_completo}</td>
      <td>${usuario.correo_electronico}</td>
      <td>${usuario.rol}</td>
      <td>${estadoTexto}</td>
      <td>${acciones}</td>
    `;
    tablaUsuarios.appendChild(tr);
  });
}

// =======================
// Mostrar modal de creación
// =======================
document.getElementById("btnAgregarUsuario").addEventListener("click", () => {
  formUsuario.reset();
  document.getElementById("id_usuario").value = "";
  passwordGroup.style.display = "block";
  modalTitle.textContent = "Nuevo Usuario";
  modalUsuario.show();
});

// =======================
// Guardar usuario (POST / PUT)
// =======================
formUsuario.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("id_usuario").value;
  const nombre_completo = document.getElementById("nombre_completo").value.trim();
  const correo = document.getElementById("correo_electronico").value.trim();
  const rol = document.getElementById("rol").value;
  const contrasena = document.getElementById("contrasena").value;

  if (!nombre_completo || !correo || !rol || (!id && !contrasena)) {
    alert("Completa todos los campos requeridos.");
    return;
  }

  const data = {
    nombre_completo,
    correo_electronico: correo,
    rol,
  };

  if (!id) {
    data.contrasena = contrasena;
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(() => {
        modalUsuario.hide();
        cargarUsuarios();
      });
  } else {
    fetch(`${API_URL}${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(() => {
        modalUsuario.hide();
        cargarUsuarios();
      });
  }
});

// =======================
// Editar usuario
// =======================
function editarUsuario(id) {
  fetch(`${API_URL}${id}`)
    .then(res => res.json())
    .then(usuario => {
      document.getElementById("id_usuario").value = usuario.id_usuario;
      document.getElementById("nombre_completo").value = usuario.nombre_completo;
      document.getElementById("correo_electronico").value = usuario.correo_electronico;
      document.getElementById("rol").value = usuario.rol;
      passwordGroup.style.display = "none";
      modalTitle.textContent = "Editar Usuario";
      modalUsuario.show();
    });
}

// =======================
// Eliminar usuario
// =======================
function eliminarUsuario(id) {
  if (confirm("¿Deseas eliminar este usuario?")) {
    fetch(`${API_URL}eliminar/${id}`, {
      method: "PATCH",
    }).then(() => cargarUsuarios());
  }
}

// =======================
// Restaurar usuario
// =======================
function restaurarUsuario(id) {
  if (confirm("¿Restaurar este usuario?")) {
    fetch(`${API_URL}restaurar/${id}`, {
      method: "PATCH",
    }).then(() => cargarUsuarios());
  }
}

// =======================
// Inicializar
// =======================
cargarUsuarios();
