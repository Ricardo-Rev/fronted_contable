// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menu-toggle');
  const contentContainer = document.getElementById('dynamic-content');

  // Mostrar/ocultar sidebar en móviles
  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.style.display = 'none';
    });
  }

  // Enlaces con data-section
  const links = document.querySelectorAll('[data-section]');
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const sectionUrl = this.getAttribute('data-section');
      cargarSeccionConScript(sectionUrl);
    });
  });

  // Submenús desplegables
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = this.nextElementSibling;
      submenu.classList.toggle('show');
    });
  });

  // Función para cargar sección HTML
  function loadSection(url, callback = null) {
    fetch(`pages/${url}`)
      .then(response => {
        if (!response.ok) throw new Error(`No se pudo cargar ${url}`);
        return response.text();
      })
      .then(html => {
        contentContainer.innerHTML = html;
        if (callback) callback(); // Ejecuta el callback si existe
      })
      .catch(error => {
        contentContainer.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
      });
  }

  // Carga HTML y su JS asociado si aplica
  function cargarSeccionConScript(sectionUrl) {
    if (sectionUrl.includes("usuarios")) {
      loadSection(sectionUrl, () => {
        const script = document.createElement("script");
        script.src = "scripts/usuarios.js";
        script.defer = true;
        document.body.appendChild(script);
      });
    } else {
      loadSection(sectionUrl);
    }
  }
});
