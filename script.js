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
let congratulated = false;
let couponStage = false;

introVideo.addEventListener("ended", () => {
    introVideo.style.display = "none"; 
    welcomeScreen.style.display = "flex"; 
});

function generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let couponCode = '';
    for (let i = 0; i < 7; i++) {
        if(i===3){
            couponCode += "-";
        }
        else{
            couponCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    return couponCode;
}

// Función para avanzar en la bienvenida
function advanceWelcome() {
    if (welcomeStage === 1) {
        speechBubble.textContent = "Hace algunos días atrás se envió a un grupo de nanos a una misión importante, pero....";
        welcomeCharacter.src = "imagenes/OkaMilitar.png";
        welcomeStage = 2;
    } else if (welcomeStage === 2) {
        speechBubble.textContent = "Nos topamos con enemigos que no esperabamos...";
        welcomeStage = 3;
    } else if (welcomeStage === 3) {
        speechBubble.textContent = "Las verduras espaciales del planeta Verdun! Liderados por el audaz Capitán Tomate";
        welcomeStage = 4;
    } else if (welcomeStage === 4) {
        speechBubble.textContent = "Mis solados nanos fueron embozcados y ahora necesitan escapar, nos podrías ayudar?";
        welcomeStage = 5; 
    } else if (welcomeStage === 5) {
        speechBubble.textContent = "Muy bien, Soldado!, lo que debes hacer es meter a todos los nanos que puedas a la nave.";
        welcomeStage = 6; 
    } else if (welcomeStage === 6) {
        speechBubble.textContent = "Ten cuidado de no meter a las malas verduras también!, además no dejes caer a ningun nano al vacío!";
        welcomeStage = 7; 
    } else if (welcomeStage === 7) {
        speechBubble.textContent = "Muy bien, apresurate, todos confiamos en ti, hazlo y te daremos una recompensa.";
        welcomeStage = 8; 
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

welcomeScreen.addEventListener("click", () => {
    if (congratulated) {
        showCoupon();
    } else {
        advanceWelcome();
    }
});

// Mover el bowl con el toque
gameArea.addEventListener("touchmove", (event) => {
    if (!gameActive) return;
    const touch = event.touches[0];
    let bowlX = touch.clientX - gameArea.offsetLeft - bowlContainer.offsetWidth / 2;
    bowlX = Math.max(0, Math.min(gameArea.offsetWidth - bowlContainer.offsetWidth, bowlX));
    bowlContainer.style.left = bowlX + "px";
});

const badItemImages = ["imagenes/brocoli.png", "imagenes/zanahoria.png", "imagenes/tomate.png"];
const goodItemImages = ["imagenes/morado.png", "imagenes/rosa.png"];

// Función para crear elementos que caen
function createItem() {
    if (!gameActive) return;

    // Crear el contenedor del hitbox
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");

    // Crear el elemento visual con la imagen y ajustarlo
    const item = document.createElement("div");
    item.classList.add("item");

    if (Math.random() < 0.6) {
        const randomGoodIndex = Math.floor(Math.random() * goodItemImages.length);
        item.style.backgroundImage = `url(${goodItemImages[randomGoodIndex]})`;
    } else {
        item.classList.add("badItem");
        const randomBadIndex = Math.floor(Math.random() * badItemImages.length);
        item.style.backgroundImage = `url(${badItemImages[randomBadIndex]})`;
    }

    // Posicionar el contenedor y agregar el item dentro
    const margin = 80;
    const maxLeftPosition = gameArea.offsetWidth - itemContainer.offsetWidth - margin;
    itemContainer.style.left = Math.max(margin, Math.random() * maxLeftPosition) + "px";
    itemContainer.style.top = "0px";
    gameArea.appendChild(itemContainer);
    itemContainer.appendChild(item); // Añadir el item al contenedor

    // Animación de caída
    let fallInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(fallInterval);
            return;
        }

        let itemTop = parseFloat(itemContainer.style.top);
        itemContainer.style.top = itemTop + (gameArea.offsetHeight * 0.015) + "px";

        if (itemTop >= gameArea.offsetHeight - bowlContainer.offsetHeight - itemContainer.offsetHeight) {
            const bowlLeft = parseFloat(bowlContainer.style.left);
            const bowlRight = bowlLeft + bowlContainer.offsetWidth;
            const itemLeft = parseFloat(itemContainer.style.left);
            const itemRight = itemLeft + itemContainer.offsetWidth;
        
            if (itemTop + itemContainer.offsetHeight >= gameArea.offsetHeight - bowlContainer.offsetHeight &&
                itemTop + itemContainer.offsetHeight <= gameArea.offsetHeight - (bowlContainer.offsetHeight / 2)) { 
                // Verificar la colisión solo con la parte superior del bowl
                const bowlLeft = parseFloat(bowlContainer.style.left);
                const bowlRight = bowlLeft + bowlContainer.offsetWidth;
                const itemLeft = parseFloat(itemContainer.style.left);
                const itemRight = itemLeft + itemContainer.offsetWidth;
            
                // Detectar si el item está dentro de los límites horizontales del bowl
                if (itemLeft < bowlRight && itemRight > bowlLeft) {
                    if (!item.classList.contains("badItem")) {
                        score += 10;
                        scoreDisplay.textContent = "Puntos: " + score;
                        checkForCongratulations();
                    } else {
                        lives -= 1;
                        livesDisplay.textContent = "Vidas: " + lives;
                        triggerDamageEffect(); // Activar el efecto de daño
                        if (lives === 0) {
                            endGame();
                        }
                    }
                    if (itemContainer.parentNode) {
                        itemContainer.remove();
                    }
                    clearInterval(fallInterval);
                }
            }
        }            
    }, 30);
}

function triggerDamageEffect() {
    const damageOverlay = document.getElementById("damageOverlay");
    damageOverlay.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Activar rojo semitransparente

    setTimeout(() => {
        damageOverlay.style.backgroundColor = "rgba(255, 0, 0, 0)"; // Volver a transparente
    }, 500);
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
    welcomeCharacter.src = "imagenes/OkaMilitar.png";
    welcomeScreen.style.display = "flex";
}

// Función para mostrar el mensaje de agradecimiento y el cupón
function showCoupon() {
    const couponCode = generateCouponCode(); // Generar el código único de cupón
    speechBubble.textContent = `Gracias por ayudarnos, gracias a ti todos pudieron escapar!. ¡Ten este cupón: ${couponCode}, ahora puedes ir a comer muchos dulces al CandyBar del MegaCenter!`;
    welcomeCharacter.src = "imagenes/OkaMilitar.png";
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

function showEndVideo() {
    welcomeScreen.style.display = "none";

    const endVideo = document.getElementById("endVideo");
    endVideo.style.display = "block";
    endVideo.play();
    welcomeScreen.removeEventListener("click", showEndVideo);
}