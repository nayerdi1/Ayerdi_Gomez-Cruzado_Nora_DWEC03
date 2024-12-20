const urlParams = new URLSearchParams(window.location.search);
const nivel = urlParams.get('nivel');

const tablero = document.querySelector('.tablero');
let juegoTerminado = false;
let filas = 6;
let columnas;
let tiempoRestante;

nivelSeleccionado(nivel);

const palabrasJson = await cargarFichero('../json/palabras.json');

const palabrasCategoria = palabrasJson[nivel];
const palabraAleatoria = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)];

console.log(palabraAleatoria);

ajustarTablero(filas, columnas);

iniciarReloj(100);

let filaActual = 0;
let columnaActual = 0;
let palabraEscrita = "";
let intento = 1;
let restantes = 5;
let resultado;

tableroInfo();

let boton = document.querySelector('button');
boton.disabled = true;

document.addEventListener('keydown', (event) => {
    if(!juegoTerminado) {
        escribirPalabra(event);       
    }
});

boton.addEventListener('click', () => {
    if(!boton.disabled) {
        comprobarPalabra();
    }
});




//FUNCIONES
// Asignar cantidad de columnas según el nivel elegido
function nivelSeleccionado(nivel){
    switch (nivel) {
        case 'facil':
            columnas = 5;
            break;
        case 'medio':
            columnas = 6;
            break;
        case 'dificil':
            columnas = 8;
            break;
        default:
            columnas = 5;
    } 
}

// Ajustar el tablero segun el numero de filas y columnas
function ajustarTablero(filas, columnas) {
   
    // Limpiar el tablero antes de agregar los nuevos cuadros
    tablero.innerHTML = '';

    // Generar las 6 filas
    for (let i = 0; i < filas; i++) {
        const fila = document.createElement('div');
        fila.classList.add('fila');
        
        // Crear el numero de cuadros en cada fila
        for (let j = 0; j < columnas; j++) {
            const cuadro = document.createElement('div');
            cuadro.classList.add('cuadro');
            fila.appendChild(cuadro);
        }

        // Añadir la fila al tablero
        tablero.appendChild(fila);
    }
}

// Cargar el fichero JSON con las palabras
async function cargarFichero(path){
    const response = await fetch(path);
    if(!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
};

// Capturar letras introducidas por teclado y añadirlas en la fila y cuadro correspondiente
// Habilita o deshabilita el boton "enviar"
function escribirPalabra(event) {
    const letra = event.key;
    // Controlar si es una letra
    if (letra.length === 1 && /[a-zA-Z]/.test(letra)) {
        // Controlar si se ha completado la fila
        if(columnaActual < columnas) { 
            escribirEnLaFila().textContent = letra.toUpperCase();
            columnaActual++;
            palabraEscrita += letra;
            // Habilita el boton cuando se llena la fila
            if(palabraEscrita.length == columnas){
                boton.disabled = false;
            }
        } else {
            console.log(`No puedes meter mas letras en la fila ${filaActual + 1}.`);
        }
    // Controlar si se borra letra
    } else if (letra === "Backspace") {
        // Controlar si se ha borrado toda la fila
        if (columnaActual > 0) {
            columnaActual--;
            escribirEnLaFila().textContent = "";
            palabraEscrita = palabraEscrita.slice(0, -1);
            // Deshabilita el boton si la fila no esta completa
            if(palabraEscrita.length < columnas){
                boton.disabled = true;
            }
        } else {
            console.log("No hay más letras para borrar en esta fila.");
        }
    } else {
        console.log("Introduce una letra valida");
    }

    // Controlar si el tablero está lleno
    if (columnaActual >= columnas && filaActual >= filas - 1) {
        console.log("No puedes introducir más letras. Tablero completo.");
    }

}

// Recupera la fila para escribir en ella
function escribirEnLaFila() {
    const filaAEscribir = tablero.children[filaActual];
    return filaAEscribir.children [columnaActual];
}

// Comprueba la palabra introducida
function comprobarPalabra(){
    // Comprueba si la palabra introducida coincide con la palabra escondida
    if(palabraEscrita == palabraAleatoria) {
        let cuadrosFila = recuperarCuadros(filaActual);
        cuadrosFila.forEach(cuadro => {
            cuadro.classList.add('correcto');
        });

        juegoTerminado = true;
        resultado = "ganar";
        // Retarda 2 segundos la redireccion
        setTimeout(() => {
            redireccionar();
        }, 2000);
    
    // Busca coincidencias en las letras
    } else {    
        // Bucle para recorrer la palabra
        for (let i = 0; i < palabraAleatoria.length ; i++) {
            let letraPalabraOculta = palabraAleatoria[i];
            let letraPalabraIntroducida = palabraEscrita[i];
            const cuadrosFila = recuperarCuadros(filaActual); 
            const cuadroACambiar = cuadrosFila[i];
            // Comprueba si las letras en la misma posicion son iguales y aplica clase "correcto"
            if(letraPalabraOculta == letraPalabraIntroducida) {
                cambiarUnCuadro('correcto', cuadroACambiar);
                    
            } else {
                for(let y = 0; y < palabraAleatoria.length ; y++) {
                    let letraOculta = palabraAleatoria[y];
                    // Comprueba si las letras son iguales en diferentes posiciones y aplica clase "amarillo"
                    if (letraPalabraIntroducida == letraOculta) {
                        cambiarUnCuadro('amarillo', cuadroACambiar);
                    }
                }                       
            }
            // Si no hay coincidencias, aplica la clase "gris"
            if (!cuadroACambiar.classList.contains('correcto') && 
                !cuadroACambiar.classList.contains('amarillo')) {
                cambiarUnCuadro('gris', cuadroACambiar);
            }
                    
        }       
    } 
    // Si no se acierta la palabra, pasa a la siguiente fila y deshabilita el boton
    if(!juegoTerminado){
        actualizarFila();
        boton.disabled = true;
    }      
}

// Recupera todos los cuadros de una fila
function recuperarCuadros(filaActual) {
    const recuperarFilas = document.querySelectorAll('.fila');    
    return recuperarFilas[filaActual].querySelectorAll('.cuadro');       
}

// Cambia la clase de un cuadro
function cambiarUnCuadro(clase, cuadroACambiar) {
    cuadroACambiar.classList.add(clase); 
}

// Pinta la info en la tabla de informacion
function tableroInfo() {  
    document.getElementById('intentos').textContent = "Intento número: " + intento;
    document.getElementById('restantes').textContent = "Intentos restantes: " + restantes;
}

// Si quedan mas filas, actualiza las variables
// Si no quedan intentos, llama a redireccionar
function actualizarFila(){   
    if (intento < filas) {
        intento++;
        restantes--;
        filaActual++;
        columnaActual = 0;
        palabraEscrita = "";
        tableroInfo();
    } else{
        window.location.href = "resultados.html";
        resultado = 'noIntentos';
        redireccionar();
    }    
}

// Redirecciona a resultados pasandole los resultados obtenidos
function redireccionar() {
    window.location.href = `resultados.html?resultado=${resultado}&intento=${intento}&tiempo=${tiempoRestante}`;
}

// Inicia la cuenta atras de 100 segundos y lo pinta en la tabla de informacion
function iniciarReloj(tiempo){
    const cuentaAtras = document.getElementById("tiempo");
    tiempoRestante = tiempo;
    cuentaAtras.textContent = 'Tiempo restante: ' + tiempoRestante;

    const intervalo = setInterval(() => {
        tiempoRestante--;
        cuentaAtras.textContent = 'Tiempo restante: ' + tiempoRestante;
        // Si el tiempo llega a 0, redirige al login
        if(tiempoRestante <= 0) {
            clearInterval(intervalo);
            window.location.href = `../index.html`;
        }
    }, 1000);
    
}