const gameArea = document.getElementById("gameArea");
const bowl = document.getElementById("bowl");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverMessage = document.getElementById("gameOverMessage");
const welcomeScreen = document.getElementById("welcomeScreen");
const speechBubble = document.getElementById("speechBubble");
const welcomeCharacter = document.getElementById("welcomeCharacter");
const introVideo = document.getElementById("introVideo");


let score = 0;
let lives = 3;
let gameInterval;
let gameActive = false; // Variable para controlar si el juego está activo
let welcomeStage = 1; // Variable para rastrear la etapa de bienvenida

introVideo.addEventListener("ended", () => {
    introVideo.style.display = "none"; 
    welcomeScreen.style.display = "flex"; // Muestra la pantalla de bienvenida
});

// Función para avanzar en la bienvenida
function advanceWelcome() {
    if (welcomeStage === 1) {
        speechBubble.textContent = "En una galaxia lejana y colorida....";
        welcomeCharacter.src = "imagenes/morado.png";
        welcomeStage = 2;
    } else if (welcomeStage === 2) {
        speechBubble.textContent = "Los dulces se aventuran al espacio en busca de nuevas delicias, pero....";
        welcomeStage = 3;
    } else if (welcomeStage === 3) {
        speechBubble.textContent = "O no!! Las verduras espaciales, han llegado también! Liderados por el audaz Capitán Tomate";
        welcomeStage = 4;
    } else if (welcomeStage === 4) {
        speechBubble.textContent = "Mis dulces y yo nos estamos preparando para la batalla, pero necesitamos ayuda! ¿Podrías ayudarnos a derrotar a las verduras?";
        welcomeStage = 5; 
    } else {
        startGame(); 
    }
}
// Función para iniciar el juego
function startGame() {
    welcomeScreen.style.display = "none"; // Oculta la pantalla de bienvenida
    gameActive = true;
    gameInterval = setInterval(createItem, 1000); // Empieza a crear elementos que caen
}

// Escucha el clic en la pantalla de bienvenida para avanzar o iniciar el juego
welcomeScreen.addEventListener("click", advanceWelcome);

// Mover el bowl con el toque
gameArea.addEventListener("touchmove", (event) => {
    if (!gameActive) return; // Evita el movimiento si el juego ha terminado
    const touch = event.touches[0];
    let bowlX = touch.clientX - gameArea.offsetLeft - bowl.offsetWidth / 2;
    bowlX = Math.max(0, Math.min(gameArea.offsetWidth - bowl.offsetWidth, bowlX));
    bowl.style.left = bowlX + "px";
});

const badItemImages = ["imagenes/brocoli.png", "imagenes/zanahoria.png", "imagenes/tomate.png"];
const goodItemImages = ["imagenes/morado.png", "imagenes/rosa.png"];

// Crea los elementos que caen
function createItem() {
    if (!gameActive) return; // Evita crear nuevos elementos si el juego ha terminado
    const item = document.createElement("div");
    item.classList.add("item");

    // Randomizar el tipo de item (bueno o malo)
    if (Math.random() < 0.6) {
        // Asignar una imagen aleatoria a los elementos buenos
        const randomGoodIndex = Math.floor(Math.random() * goodItemImages.length);
        item.style.backgroundImage = `url(${goodItemImages[randomGoodIndex]})`;
        item.style.backgroundSize = "cover";
    } else {
        item.classList.add("badItem");

        // Asignar una imagen aleatoria a los elementos malos
        const randomBadIndex = Math.floor(Math.random() * badItemImages.length);
        item.style.backgroundImage = `url(${badItemImages[randomBadIndex]})`;
        item.style.backgroundSize = "cover";
    }

    // Posición inicial aleatoria
    const margin = 80;
    const maxLeftPosition = gameArea.offsetWidth - item.offsetWidth - margin;
    item.style.left = Math.max(margin, Math.random() * maxLeftPosition) + "px";
    item.style.top = "0px";
    gameArea.appendChild(item);

    // Hacer que el item caiga
    let fallInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(fallInterval);
            return;
        }

        let itemTop = parseFloat(item.style.top);
        item.style.top = itemTop + (gameArea.offsetHeight * 0.015) + "px";

        // Comprobar si el item toca el recipiente
        if (itemTop >= gameArea.offsetHeight - bowl.offsetHeight - item.offsetHeight) {
            const bowlLeft = parseFloat(bowl.style.left);
            const bowlRight = bowlLeft + bowl.offsetWidth;
            const itemLeft = parseFloat(item.style.left);
            const itemRight = itemLeft + item.offsetWidth;

            if (itemLeft < bowlRight && itemRight > bowlLeft) {
                if (!item.classList.contains("badItem")) {
                    score += 10;
                    scoreDisplay.textContent = "Puntos: " + score;
                } else {
                    lives -= 1;
                    livesDisplay.textContent = "Vidas: " + lives;
                    if (lives === 0) {
                        endGame();
                    }
                }
                if (item.parentNode) {
                    item.remove();
                }
                clearInterval(fallInterval);
            }
        }

        // Eliminar el item si sale de los límites
        if (itemTop > gameArea.offsetHeight) {
            if (item.parentNode) {
                item.remove();
            }
            clearInterval(fallInterval);
        }
    }, 30);
}

// Termina el juego
function endGame() {
    gameActive = false; // Detiene todas las acciones del juego
    clearInterval(gameInterval); // Detiene el intervalo de creación de elementos
    gameOverMessage.style.display = "block";

    // Remove all items from the game area
    const items = document.querySelectorAll(".item");
    items.forEach(item => item.remove());
}