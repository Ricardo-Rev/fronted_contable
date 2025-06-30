document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');

    // Mostrar u ocultar sidebar en móviles
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

    // Navegar entre secciones
    const links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
});

function showSection(section) {
    let content = document.querySelector('.content .container');

    let message = `
        <h2 class="mb-4">${section.charAt(0).toUpperCase() + section.slice(1)}</h2>
        <p class="lead">Este es el contenido de la sección <strong>${section}</strong>.</p>
        <p>Aquí puedes cargar dinámicamente componentes o realizar llamadas a API.</p>
    `;

    if (content) {
        content.innerHTML = message;
    }
}