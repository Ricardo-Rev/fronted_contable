(() => {
  // URL base segura, evita redeclaración
  window.API_URL_NOMENCLATURAS = window.API_URL_NOMENCLATURAS || "http://127.0.0.1:5000/api/nomenclaturas/";

  // Elementos DOM
  const tablaNomenclaturas = document.getElementById("tablaNomenclaturas");
  const formNomenclatura = document.getElementById("formNomenclatura");
  const modalNomenclatura = new bootstrap.Modal(document.getElementById("modalNomenclatura"));
  const modalTitle = document.getElementById("modalNomenclaturaLabel");

  // Carga listado de nomenclaturas desde API
  function cargarNomenclaturas() {
    fetch(window.API_URL_NOMENCLATURAS)
      .then(res => res.json())
      .then(data => renderTablaNomenclaturas(data))
      .catch(err => console.error("Error al cargar nomenclaturas:", err));
  }

  // Renderiza la tabla con los datos
  function renderTablaNomenclaturas(data) {
    tablaNomenclaturas.innerHTML = "";
    data.forEach(nomenclatura => {
      const estadoTexto = nomenclatura.estado == 1
        ? '<span class="badge bg-success">Activo</span>'
        : '<span class="badge bg-danger">Inactivo</span>';

      const acciones = nomenclatura.estado == 1
        ? `<button class="btn btn-warning btn-sm me-1" onclick="editarNomenclatura(${nomenclatura.id_nomenclatura})">
             <i class="bi bi-pencil-square"></i></button>
           <button class="btn btn-danger btn-sm" onclick="eliminarNomenclatura(${nomenclatura.id_nomenclatura})">
             <i class="bi bi-trash"></i></button>`
        : `<button class="btn btn-info btn-sm" onclick="restaurarNomenclatura(${nomenclatura.id_nomenclatura})">
             <i class="bi bi-arrow-counterclockwise"></i></button>`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${nomenclatura.id_nomenclatura}</td>
        <td>${nomenclatura.nombre}</td>
        <td>${nomenclatura.descripcion || ''}</td>
        <td>${estadoTexto}</td>
        <td>${acciones}</td>
      `;
      tablaNomenclaturas.appendChild(tr);
    });
  }

  // Abrir modal para nueva nomenclatura
  document.getElementById("btnAgregarNomenclatura").addEventListener("click", () => {
    formNomenclatura.reset();
    document.getElementById("id_nomenclatura").value = "";
    modalTitle.textContent = "Nueva Nomenclatura";
    modalNomenclatura.show();
  });

  // Guardar (crear o actualizar) nomenclatura
  formNomenclatura.addEventListener("submit", e => {
    e.preventDefault();

    const id = document.getElementById("id_nomenclatura").value;
    const nombre = document.getElementById("nombre_nomenclatura").value.trim();
    const descripcion = document.getElementById("descripcion_nomenclatura").value.trim();
    const estadoSelect = document.getElementById("estado_nomenclatura");

    if (!nombre) {
      alert("El nombre es obligatorio.");
      return;
    }

    const data = { nombre, descripcion };

    if (!id) {
      // Crear nueva nomenclatura
      fetch(window.API_URL_NOMENCLATURAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(() => {
          modalNomenclatura.hide();
          cargarNomenclaturas();
        });
    } else {
      // Actualizar nomenclatura
      data.estado = parseInt(estadoSelect.value);
      fetch(`${window.API_URL_NOMENCLATURAS}${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(() => {
          modalNomenclatura.hide();
          cargarNomenclaturas();
        });
    }
  });

  // Funciones globales para usar en onclick desde HTML dinámico
  window.editarNomenclatura = function(id) {
    fetch(`${window.API_URL_NOMENCLATURAS}${id}`)
      .then(res => res.json())
      .then(nomenclatura => {
        document.getElementById("id_nomenclatura").value = nomenclatura.id_nomenclatura;
        document.getElementById("nombre_nomenclatura").value = nomenclatura.nombre;
        document.getElementById("descripcion_nomenclatura").value = nomenclatura.descripcion || "";
        document.getElementById("estado_nomenclatura").value = nomenclatura.estado;
        modalTitle.textContent = "Editar Nomenclatura";
        modalNomenclatura.show();
      });
  };

  window.eliminarNomenclatura = function(id) {
    if (confirm("¿Deseas eliminar esta nomenclatura?")) {
      fetch(`${window.API_URL_NOMENCLATURAS}eliminar/${id}`, { method: "PATCH" })
        .then(() => cargarNomenclaturas());
    }
  };

  window.restaurarNomenclatura = function(id) {
    if (confirm("¿Deseas restaurar esta nomenclatura?")) {
      fetch(`${window.API_URL_NOMENCLATURAS}restaurar/${id}`, { method: "PATCH" })
        .then(() => cargarNomenclaturas());
    }
  };

  // Carga inicial
  cargarNomenclaturas();
})();
