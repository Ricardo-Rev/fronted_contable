// scripts/usuarios.js
const API_URL = "http://127.0.0.1:5000/api/usuarios/";

const tablaUsuarios = document.getElementById("tablaUsuarios");
const formUsuario = document.getElementById("formUsuario");
const modalUsuario = new bootstrap.Modal(document.getElementById("modalUsuario"));
const modalTitle = document.getElementById("modalUsuarioLabel");
const passwordGroup = document.getElementById("passwordGroup");
const estadoGroup = document.getElementById("estadoGroup");

function cargarUsuarios() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      renderTablaUsuarios(data);
    })
    .catch(err => console.error("Error al cargar usuarios:", err));
}

function renderTablaUsuarios(data) {
  tablaUsuarios.innerHTML = "";
  data.forEach(usuario => {
    const estadoTexto = usuario.estado == 1
      ? '<span class="badge bg-success">Activo</span>'
      : '<span class="badge bg-danger">Inactivo</span>';

    const acciones = usuario.estado == 1
      ? `<button class="btn btn-warning btn-sm me-1" onclick="editarUsuario(${usuario.id_usuario})"><i class="bi bi-pencil-square"></i></button>
         <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id_usuario})"><i class="bi bi-trash"></i></button>`
      : `<button class="btn btn-info btn-sm" onclick="restaurarUsuario(${usuario.id_usuario})"><i class="bi bi-arrow-counterclockwise"></i></button>`;

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

document.getElementById("btnAgregarUsuario").addEventListener("click", () => {
  formUsuario.reset();
  document.getElementById("id_usuario").value = "";
  passwordGroup.style.display = "block";
  estadoGroup.style.display = "none"; // ocultar estado al crear
  modalTitle.textContent = "Nuevo Usuario";
  modalUsuario.show();
});

formUsuario.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("id_usuario").value;
  const nombre_completo = document.getElementById("nombre_completo").value.trim();
  const correo_electronico = document.getElementById("correo_electronico").value.trim();
  const rol = document.getElementById("rol").value;
  const contrasena = document.getElementById("contrasena").value;
  const estado = document.getElementById("estado").value;

  if (!nombre_completo || !correo_electronico || !rol || (!id && !contrasena)) {
    alert("Completa todos los campos requeridos.");
    return;
  }

  const data = { nombre_completo, correo_electronico, rol };

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
    data.estado = parseInt(estado);
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

function editarUsuario(id) {
  fetch(`${API_URL}${id}`)
    .then(res => res.json())
    .then(usuario => {
      document.getElementById("id_usuario").value = usuario.id_usuario;
      document.getElementById("nombre_completo").value = usuario.nombre_completo;
      document.getElementById("correo_electronico").value = usuario.correo_electronico;
      document.getElementById("rol").value = usuario.rol;
      document.getElementById("estado").value = usuario.estado;
      passwordGroup.style.display = "none";
      estadoGroup.style.display = "block";
      modalTitle.textContent = "Editar Usuario";
      modalUsuario.show();
    });
}

function eliminarUsuario(id) {
  if (confirm("¿Deseas eliminar este usuario?")) {
    fetch(`${API_URL}eliminar/${id}`, { method: "PATCH" }).then(() => cargarUsuarios());
  }
}

function restaurarUsuario(id) {
  if (confirm("¿Deseas restaurar este usuario?")) {
    fetch(`${API_URL}restaurar/${id}`, { method: "PATCH" }).then(() => cargarUsuarios());
  }
}

cargarUsuarios();
