const urlParams = new URLSearchParams(window.location.search);
const resultado = urlParams.get('resultado');
// Comprueba si el parametro 'resultado'
if (resultado == "ganar") {
    const intentos = urlParams.get('intento');
    const tiempo = urlParams.get('tiempo');
    document.getElementById('resultado').textContent = "¡Has ganado!";
    document.getElementById('intentos').textContent = "Intentos que has necesitado: " + intentos;
    document.getElementById('tiempo').textContent = "Tiempo que has necesitado: " + (100-tiempo) + " segundos";

} else {
    document.getElementById('resultado').textContent = "¡Has perdido!";
    document.getElementById('intentos').textContent = "Has agotado los intentos. Mas suerte la proxima vez";
}
/*
const botonVolver = document.getElementById('volver');
botonVolver.addEventListener('click', () => {
    window.location.href = 'inicio.html'    
  
});

const botonSalir = document.getElementById('salir');
botonSalir.addEventListener('click', () => {
    window.location.href = '../index.html'    
  
});*/