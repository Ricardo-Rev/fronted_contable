document.getElementById("recoverForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;

    fetch("/api/auth/olvide_contrasena", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo_electronico: email })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Ocurrió un error al intentar restablecer la contraseña.");
    });
});