// Variables para los elementos
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
let gameActive = false;
let welcomeStage = 1;
let congratulated = false; // Variable para controlar la felicitación
let couponStage = false; // Nueva variable para controlar la pantalla de cupón

introVideo.addEventListener("ended", () => {
    introVideo.style.display = "none"; 
    welcomeScreen.style.display = "flex"; 
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
    welcomeScreen.style.display = "none"; 
    gameActive = true;
    gameInterval = setInterval(createItem, 1000); 
}

// Escucha el clic en la pantalla de bienvenida para avanzar o iniciar el juego
welcomeScreen.addEventListener("click", () => {
    if (congratulated) {
        showCoupon(); // Mostrar el cupón si el usuario ya ha sido felicitado
    } else {
        advanceWelcome();
    }
});

// Mover el bowl con el toque
gameArea.addEventListener("touchmove", (event) => {
    if (!gameActive) return;
    const touch = event.touches[0];
    let bowlX = touch.clientX - gameArea.offsetLeft - bowl.offsetWidth / 2;
    bowlX = Math.max(0, Math.min(gameArea.offsetWidth - bowl.offsetWidth, bowlX));
    bowl.style.left = bowlX + "px";
});

const badItemImages = ["imagenes/brocoli.png", "imagenes/zanahoria.png", "imagenes/tomate.png"];
const goodItemImages = ["imagenes/morado.png", "imagenes/rosa.png"];

// Función para crear elementos que caen
function createItem() {
    if (!gameActive) return;
    const item = document.createElement("div");
    item.classList.add("item");

    if (Math.random() < 0.6) {
        const randomGoodIndex = Math.floor(Math.random() * goodItemImages.length);
        item.style.backgroundImage = `url(${goodItemImages[randomGoodIndex]})`;
        item.style.backgroundSize = "cover";
    } else {
        item.classList.add("badItem");
        const randomBadIndex = Math.floor(Math.random() * badItemImages.length);
        item.style.backgroundImage = `url(${badItemImages[randomBadIndex]})`;
        item.style.backgroundSize = "cover";
    }

    const margin = 80;
    const maxLeftPosition = gameArea.offsetWidth - item.offsetWidth - margin;
    item.style.left = Math.max(margin, Math.random() * maxLeftPosition) + "px";
    item.style.top = "0px";
    gameArea.appendChild(item);

    let fallInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(fallInterval);
            return;
        }

        let itemTop = parseFloat(item.style.top);
        item.style.top = itemTop + (gameArea.offsetHeight * 0.015) + "px";

        if (itemTop >= gameArea.offsetHeight - bowl.offsetHeight - item.offsetHeight) {
            const bowlLeft = parseFloat(bowl.style.left);
            const bowlRight = bowlLeft + bowl.offsetWidth;
            const itemLeft = parseFloat(item.style.left);
            const itemRight = itemLeft + item.offsetWidth;

            if (itemLeft < bowlRight && itemRight > bowlLeft) {
                if (!item.classList.contains("badItem")) {
                    score += 10;
                    scoreDisplay.textContent = "Puntos: " + score;
                    checkForCongratulations(); 
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

        if (itemTop > gameArea.offsetHeight) {
            if (item.parentNode) {
                item.remove();
            }
            clearInterval(fallInterval);
        }
    }, 30);
}

// Función para verificar si la puntuación alcanza 300
function checkForCongratulations() {
    if (score >= 300 && !congratulated) {
        congratulated = true;
        showCongratulations(); 
    }
}

// Función para mostrar el mensaje de felicitaciones
function showCongratulations() {
    gameActive = false; // Pausar el juego temporalmente
    clearInterval(gameInterval);

    // Configurar y mostrar la pantalla de felicitación
    speechBubble.textContent = "¡Felicidades!";
    welcomeCharacter.src = "imagenes/rosa.png";
    welcomeScreen.style.display = "flex";
}

// Función para mostrar el mensaje de agradecimiento y el cupón
function showCoupon() {
    speechBubble.textContent = "Gracias por ayudarnos. ¡Ten este cupón!";
    welcomeCharacter.src = "imagenes/rosa.png";
    welcomeScreen.style.display = "flex";
    couponStage = true;
}

// Función para terminar el juego
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    gameOverMessage.style.display = "block";

    const items = document.querySelectorAll(".item");
    items.forEach(item => item.remove());
}
function showCoupon() {
    speechBubble.textContent = "Gracias por ayudarnos. ¡Ten este cupón!";
    welcomeCharacter.src = "imagenes/rosa.png";
    welcomeScreen.style.display = "flex";
    couponStage = true;

    // Set the QR code image source and make it visible
    const qrCode = document.getElementById("qrCode");
    qrCode.src = "imagenes/logo.png"; // Replace with actual path to the QR code image
    qrCode.style.display = "block";
    welcomeScreen.addEventListener("click", showEndVideo);
}

function showEndVideo() {
    welcomeScreen.style.display = "none";

    const endVideo = document.getElementById("endVideo");
    endVideo.style.display = "block";
    endVideo.play();
    welcomeScreen.removeEventListener("click", showEndVideo);
}