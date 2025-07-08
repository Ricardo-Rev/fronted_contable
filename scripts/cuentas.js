// cuentas.js
(() => {
  const API_URL_CUENTAS = "http://127.0.0.1:5000/api/cuentas/";

  const accordionCuentas = document.getElementById("accordionCuentas");
  const formCuenta = document.getElementById("formCuenta");
  const modalCuenta = new bootstrap.Modal(document.getElementById("modalCuenta"));
  const modalTitle = document.getElementById("modalCuentaLabel");
  const btnAgregarCuenta = document.getElementById("btnAgregarCuenta");

  async function cargarCuentas() {
    try {
      const res = await fetch(API_URL_CUENTAS);
      if (!res.ok) throw new Error("Error al cargar cuentas");
      const cuentas = await res.json();
      const cuentasJerarquicas = organizarCuentas(cuentas);
      renderAcordeonCuentas(cuentasJerarquicas);
    } catch (error) {
      console.error(error);
      accordionCuentas.innerHTML = `<div class="alert alert-danger">Error al cargar las cuentas.</div>`;
    }
  }

  function organizarCuentas(cuentas) {
    const mapa = new Map();
    cuentas.forEach(cuenta => mapa.set(cuenta.id_cuenta, { ...cuenta, hijos: [] }));
    const raiz = [];

    mapa.forEach(cuenta => {
      if (cuenta.nivel === 1) {
        raiz.push(cuenta);
      } else {
        let padreEncontrado = null;
        for (const padre of mapa.values()) {
          if (
            padre.nivel === cuenta.nivel - 1 &&
            cuenta.codigo.startsWith(padre.codigo)
          ) {
            if (!padreEncontrado || padre.codigo.length > padreEncontrado.codigo.length) {
              padreEncontrado = padre;
            }
          }
        }
        if (padreEncontrado) padreEncontrado.hijos.push(cuenta);
        else raiz.push(cuenta);
      }
    });

    return raiz;
  }

  function renderAcordeonCuentas(cuentas, parentId = "accordionCuentas") {
    accordionCuentas.innerHTML = "";
    cuentas.forEach(cuenta => {
      const itemId = `item-${cuenta.id_cuenta}`;
      const headerId = `heading-${cuenta.id_cuenta}`;
      const collapseId = `collapse-${cuenta.id_cuenta}`;
      const isPadre = cuenta.hijos.length > 0;

      const item = document.createElement("div");
      item.classList.add("accordion-item");

      item.innerHTML = `
        <h2 class="accordion-header" id="${headerId}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
            <strong>${cuenta.codigo} - ${cuenta.cuenta}</strong>
            <span class="badge bg-info ms-2">${cuenta.naturaleza}</span>
          </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#${parentId}">
          <div class="accordion-body">
            <table class="table table-sm table-dark table-striped mt-2 mb-0">
              <tbody>
                <tr><th>Nivel</th><td>${cuenta.nivel}</td></tr>
                <tr><th>Estado</th><td><span class="badge bg-${cuenta.estado ? 'success' : 'danger'}">${cuenta.estado ? 'Activo' : 'Inactivo'}</span></td></tr>
              </tbody>
            </table>

            <div class="d-flex gap-2 mt-3">
              ${!isPadre ? `
                <button class="btn btn-primary btn-sm" onclick="editarCuenta(${cuenta.id_cuenta})">
                  <i class="bi bi-pencil-square"></i> Editar
                </button>
                ${cuenta.estado
                  ? `<button class="btn btn-danger btn-sm" onclick="eliminarCuenta(${cuenta.id_cuenta})">
                      <i class="bi bi-trash"></i> Eliminar
                    </button>`
                  : `<button class="btn btn-info btn-sm" onclick="restaurarCuenta(${cuenta.id_cuenta})">
                      <i class="bi bi-arrow-counterclockwise"></i> Restaurar
                    </button>`}`
                : `<span class="text-muted"><i class="bi bi-lock-fill me-1"></i> Cuenta padre protegida</span>`}
            </div>
            ${cuenta.hijos.length > 0 ? renderHijos(cuenta.hijos, collapseId) : ""}
          </div>
        </div>
      `;

      accordionCuentas.appendChild(item);
    });
  }

  function renderHijos(hijos, parentCollapseId) {
    let html = `<div class="accordion ms-3" id="accordion-${parentCollapseId}">`;

    hijos.forEach(hijo => {
      const headerId = `heading-${hijo.id_cuenta}`;
      const collapseId = `collapse-${hijo.id_cuenta}`;
      const isPadre = hijo.hijos && hijo.hijos.length > 0;

      html += `
        <div class="accordion-item">
          <h2 class="accordion-header" id="${headerId}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
              <strong>${hijo.codigo} - ${hijo.cuenta}</strong>
              <span class="badge bg-info ms-2">${hijo.naturaleza}</span>
            </button>
          </h2>
          <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#accordion-${parentCollapseId}">
            <div class="accordion-body">
              <table class="table table-sm table-dark table-striped mt-2 mb-0">
                <tbody>
                  <tr><th>Nivel</th><td>${hijo.nivel}</td></tr>
                  <tr><th>Estado</th><td><span class="badge bg-${hijo.estado ? 'success' : 'danger'}">${hijo.estado ? 'Activo' : 'Inactivo'}</span></td></tr>
                </tbody>
              </table>
              <div class="d-flex gap-2 mt-3">
                ${!isPadre ? `
                  <button class="btn btn-primary btn-sm" onclick="editarCuenta(${hijo.id_cuenta})"><i class="bi bi-pencil-square"></i> Editar</button>
                  ${hijo.estado
                    ? `<button class="btn btn-danger btn-sm" onclick="eliminarCuenta(${hijo.id_cuenta})"><i class="bi bi-trash"></i> Eliminar</button>`
                    : `<button class="btn btn-info btn-sm" onclick="restaurarCuenta(${hijo.id_cuenta})"><i class="bi bi-arrow-counterclockwise"></i> Restaurar</button>`}`
                  : `<span class="text-muted"><i class="bi bi-lock-fill me-1"></i> Cuenta padre protegida</span>`}
              </div>
              ${hijo.hijos && hijo.hijos.length > 0 ? renderHijos(hijo.hijos, collapseId) : ""}
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  btnAgregarCuenta.addEventListener("click", () => {
    formCuenta.reset();
    document.getElementById("id_cuenta").value = "";
    modalTitle.textContent = "Nueva Cuenta";
    modalCuenta.show();
  });

  formCuenta.addEventListener("submit", async e => {
    e.preventDefault();
    const id = document.getElementById("id_cuenta").value;
    const codigo = document.getElementById("codigo").value.trim();
    const nombre_cuenta = document.getElementById("nombre_cuenta").value.trim();
    const nivel = parseInt(document.getElementById("nivel").value);
    const naturaleza = document.getElementById("naturaleza").value;

    if (!codigo || !nombre_cuenta || !nivel || !naturaleza) {
      alert("Completa todos los campos.");
      return;
    }

    const data = { codigo, cuenta: nombre_cuenta, nivel, naturaleza };

    try {
      let res;
      if (!id) {
        res = await fetch(API_URL_CUENTAS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch(API_URL_CUENTAS + id, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        alert("Error: " + (errData.error || "Algo salió mal"));
        return;
      }

      modalCuenta.hide();
      cargarCuentas();
    } catch (error) {
      console.error(error);
      alert("Error al procesar la solicitud.");
    }
  });

  window.editarCuenta = async (id) => {
    try {
      const res = await fetch(API_URL_CUENTAS + id);
      if (!res.ok) throw new Error("Cuenta no encontrada");
      const cuenta = await res.json();

      document.getElementById("id_cuenta").value = cuenta.id_cuenta;
      document.getElementById("codigo").value = cuenta.codigo;
      document.getElementById("nombre_cuenta").value = cuenta.cuenta;
      document.getElementById("nivel").value = cuenta.nivel;
      document.getElementById("naturaleza").value = cuenta.naturaleza;

      modalTitle.textContent = "Editar Cuenta";
      modalCuenta.show();
    } catch (error) {
      alert(error.message);
    }
  };

  window.eliminarCuenta = async (id) => {
    if (confirm("¿Deseas eliminar esta cuenta?")) {
      try {
        const res = await fetch(API_URL_CUENTAS + "eliminar/" + id, { method: "PATCH" });
        if (!res.ok) throw new Error("Error al eliminar cuenta");
        cargarCuentas();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  window.restaurarCuenta = async (id) => {
    if (confirm("¿Deseas restaurar esta cuenta?")) {
      try {
        const res = await fetch(API_URL_CUENTAS + "restaurar/" + id, { method: "PATCH" });
        if (!res.ok) throw new Error("Error al restaurar cuenta");
        cargarCuentas();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  cargarCuentas();
})();
