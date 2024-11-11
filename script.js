const Juego = document.getElementById('Juego');
const cubo = document.getElementById('cubo');
const Puntos = document.getElementById('Puntos');
const Vidas = document.getElementById('Vidas');
const velocidadCubo = 30;
let puntuacion = 0;
let vidas = 3;
let velocidadOka = 3;
let intervaloOka = 1000;

document.addEventListener('keydown', (e) => {
    const rectCubo = cubo.getBoundingClientRect();
    if (e.key === 'ArrowLeft' && rectCubo.left > Juego.getBoundingClientRect().left) {
        cubo.style.left = `${rectCubo.left - velocidadCubo - Juego.getBoundingClientRect().left}px`;
    }
    if (e.key === 'ArrowRight' && rectCubo.right < Juego.getBoundingClientRect().right) {
        cubo.style.left = `${rectCubo.left + velocidadCubo - Juego.getBoundingClientRect().left}px`;
    }
});

function crearOka() {
    const oka = document.createElement('div');
    oka.classList.add('okas');
    oka.style.left = `${Math.floor(Math.random() * (Juego.clientWidth - 20))}px`;
    Juego.appendChild(oka);
    soltarOka(oka);
}

function soltarOka(oka) {
    let caidaOka = setInterval(() => {
        oka.style.top = `${(parseInt(oka.style.top) || 0) + velocidadOka}px`;

        const rectOka = oka.getBoundingClientRect();
        const rectCubo = cubo.getBoundingClientRect();

        if (
            rectOka.bottom >= rectCubo.top &&
            rectOka.left >= rectCubo.left &&
            rectOka.right <= rectCubo.right
        ) {
            puntuacion++;
            Puntos.innerText = `Puntuación: ${puntuacion}`;
            oka.remove();
            clearInterval(caidaOka);

            if (puntuacion > 30) {
                aumentarDificultad();
            }
        }

        if (rectOka.top > Juego.clientHeight) {
            oka.remove();
            clearInterval(caidaOka);
            vidas--;
            Vidas.innerText = `Vidas: ${vidas}`;

            if (vidas <= 0) {
                alert("¡Juego Terminado! Puntuación Final: " + puntuacion);
                reiniciarJuego();
            }
        }
    }, 30);
}
function crearEnemigo() {
    const enemigo = document.createElement('div');
    enemigo.classList.add('enemigo');
    enemigo.style.left = `${Math.floor(Math.random() * (Juego.clientWidth - 20))}px`;
    Juego.appendChild(enemigo);
    soltarEnemigo(enemigo);
}

function soltarEnemigo(enemigo) {
    let caidaEnemigo = setInterval(() => {
        enemigo.style.top = `${(parseInt(enemigo.style.top) || 0) + velocidadOka}px`;

        const rectEnemigo = enemigo.getBoundingClientRect();
        const rectCubo = cubo.getBoundingClientRect();

        if (
            rectEnemigo.bottom >= rectCubo.top &&
            rectEnemigo.left >= rectCubo.left &&
            rectEnemigo.right <= rectCubo.right
        ) {
            vidas--;
            Vidas.innerText = `Vidas: ${vidas}`;
            enemigo.remove();
            clearInterval(caidaEnemigo);

            if (vidas <= 0) {
                alert("¡Juego Terminado! Puntuación Final: " + puntuacion);
                reiniciarJuego();
            }
        }

        if (rectEnemigo.top > Juego.clientHeight) {
            enemigo.remove();
            clearInterval(caidaEnemigo);
        }
    }, 30);
}

function aumentarDificultad() {
    velocidadOka = 7; 
    intervaloOka = 700;
}

function reiniciarJuego() {
    puntuacion = 0;
    vidas = 3;
    velocidadOka = 5;
    intervaloOka = 1000;
    Puntos.innerText = `Puntuación: ${puntuacion}`;
    Vidas.innerText = `Vidas: ${vidas}`;
}

function iniciarJuego() {
    setInterval(crearOka, intervaloOka);
    setInterval(crearEnemigo, intervaloOka * 2); 
}

iniciarJuego();
