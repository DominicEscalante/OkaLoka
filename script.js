const gameArea = document.getElementById("gameArea");
const bowl = document.getElementById("bowl");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverMessage = document.getElementById("gameOverMessage");

let score = 0;
let lives = 3;
let gameInterval;
let gameActive = true; // Variable para controlar si el juego está activo

// Move bowl with touch
gameArea.addEventListener("touchmove", (event) => {
    if (!gameActive) return; // Evita el movimiento si el juego ha terminado
    const touch = event.touches[0];
    let bowlX = touch.clientX - gameArea.offsetLeft - bowl.offsetWidth / 2;
    bowlX = Math.max(0, Math.min(gameArea.offsetWidth - bowl.offsetWidth, bowlX));
    bowl.style.left = bowlX + "px";
});

const badItemImages = ["imagenes/brocoli.png", "imagenes/zanahoria.png", "imagenes/tomate.png"];
// Create falling items
function createItem() {
    if (!gameActive) return; // Evita crear nuevos elementos si el juego ha terminado
    const item = document.createElement("div");
    item.classList.add("item");

    // Randomizar el tipo de item (bueno o malo)
    if (Math.random() < 0.6) {
        item.classList.add("okaLoka");
        item.style.backgroundColor = "#ff5a5a"; // Color para el item bueno
    } else {
        item.classList.add("badItem");

        // Asignar una imagen aleatoria a los elementos malos
        const randomIndex = Math.floor(Math.random() * badItemImages.length);
        item.style.backgroundImage = `url(${badItemImages[randomIndex]})`;
        item.style.backgroundSize = "cover"; // Ajustar la imagen al tamaño del elemento
    }

    // Posición inicial aleatoria
    const margin = 80; // Ajusta este valor según el margen deseado en píxeles
    const maxLeftPosition = gameArea.offsetWidth - item.offsetWidth - margin;
    item.style.left = Math.max(margin, Math.random() * maxLeftPosition) + "px";
    item.style.top = "0px";
    gameArea.appendChild(item);

    // Hacer que el item caiga
    let fallInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(fallInterval); // Detener la caída si el juego ha terminado
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
                if (item.classList.contains("okaLoka")) {
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
                    item.remove(); // Eliminar el elemento solo si aún está en el DOM
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

// End game
function endGame() {
    gameActive = false; // Detiene todas las acciones del juego
    clearInterval(gameInterval); // Detiene el intervalo de creación de elementos
    gameOverMessage.style.display = "block";

    // Remove all items from the game area
    const items = document.querySelectorAll(".item");
    items.forEach(item => item.remove());
}

// Start game loop
gameInterval = setInterval(createItem, 1000);
