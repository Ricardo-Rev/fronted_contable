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

  // Enlaces normales (data-section)
  const links = document.querySelectorAll('[data-section]');
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const sectionUrl = this.getAttribute('data-section');
      loadSection(sectionUrl);
    });
  });

  // Toggle submenús
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = this.nextElementSibling;
      submenu.classList.toggle('show');
    });
  });

  // Cargar archivo HTML desde carpeta /pages
  function loadSection(url) {
    fetch(`pages/${url}`)
      .then(response => {
        if (!response.ok) throw new Error(`Error al cargar ${url}`);
        return response.text();
      })
      .then(html => {
        contentContainer.innerHTML = html;
      })
      .catch(error => {
        contentContainer.innerHTML = `<p class="text-danger">No se pudo cargar la sección: ${error.message}</p>`;
      });
  }
});
