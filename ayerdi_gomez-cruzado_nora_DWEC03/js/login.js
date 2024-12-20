let usuariosJson = null;
let usuariosJsonpath = '../json/usuarios.json';

cargarUsuarios();

const password = document.getElementById("password-input");
const candado = document.getElementById("candado");

candado.addEventListener("click", () => {
    cambiarCandado();
});

document.getElementById('fuel-form').addEventListener('submit', validarUsuario);



/*--------------FUNCIONES-------------*/

//Carga el Json de usuarios en el LocalStorage
async function cargarUsuarios() {
    try {
        const cargarJson = await fetch(usuariosJsonpath);
        const usuarios = await cargarJson.json();
        
        // Guardar usuarios en LocalStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log('Usuarios cargados en LocalStorage:', usuarios);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Cambia el "type" del password, de texto a contraseña y viceversa
function cambiarCandado(){
    const cambiarPassword = password.getAttribute("type") === "password";
    password.setAttribute("type", cambiarPassword ? "text" : "password");

    candado.textContent = cambiarPassword ? "🔓" : "🔒";
}

//Comprueba y valida el usuario y la contraseña introducidos
function validarUsuario(event) {   
    event.preventDefault();

    const usuarioInput = document.getElementById('usuario-input').value;
    const passwordInput = document.getElementById('password-input').value;
    let usuarioEncontrado = false;
    let passwordFormato = false;
    const mensajeError = document.getElementById('mensaje-error');
    const regExp = /^[a-zA-Z0-9]+$/;
    //recupera los usuarios del LocalStorage en la variable
    usuariosJson = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Bucle for/of para comprobar los usuarios
    for(let usuario of usuariosJson) {       
        const usuarioValido = usuario.usuario;
        const passwordValida = usuario.contraseña;
        // Comprueba si el usuario introducido coincide
        if(usuarioValido == usuarioInput){
            usuarioEncontrado = true;
            // Valida la contraseña con la RegExp
            if(regExp.test(passwordInput)){
                passwordFormato = true;
                // Comprueba si la contraseña introducida coincide
                if(passwordValida == passwordInput) {
                    mensajeError.textContent = '';
                    window.location.href = "html/inicio.html";
                    break;
                }else {
                    mensajeError.textContent = 'Contraseña no válida.'; 
                }
            }       
        }
    }
    // Define el error para pintarlo en la interfaz
    if(!usuarioEncontrado) {
        mensajeError.textContent = 'El usuario no está registrado.';
    } else if(!passwordFormato) {
        mensajeError.textContent = 'Formato de contraseña no válido.';
    }   
}