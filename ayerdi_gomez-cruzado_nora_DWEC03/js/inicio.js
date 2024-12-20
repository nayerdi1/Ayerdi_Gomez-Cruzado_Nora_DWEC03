document.getElementById('facil').addEventListener('click', function() {
    cargarPantalla();
});

document.getElementById('medio').addEventListener('click', function() {
    cargarPantalla();
});

document.getElementById('dificil').addEventListener('click', function() {
    cargarPantalla();
});

//Redirige a juego.html
function cargarPantalla() {
    window.location.href = "juego.html"

}