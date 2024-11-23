const dates = [
    "20241009", "20241013", "20241021",
    "20241023", "20241029", "20241101", "20241102", "20241104", "20241112", 
    "20241113", "20241114", "20241119"
];
const shuffledDates = [...dates].sort(() => Math.random() - 0.5);

const gameContainer = document.getElementById("game");
const checkOrderButton = document.getElementById("check-order");
const imageModal = new bootstrap.Modal(document.getElementById("imageModal"));
const successAudio = new Audio("crisTerie.mp3"); // Ruta al archivo MP3
const errorAudio = new Audio("crisTerie.mp3"); // Ruta al archivo MP3

// Cargar imágenes de forma aleatoria
shuffledDates.forEach((date) => {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    imageWrapper.dataset.date = date;

    const img = document.createElement("img");
    img.src = `${date}.jpg`; // Cambia a la ruta donde guardes tus imágenes
    img.alt = `Imagen con fecha ${date}`;
    img.classList.add("draggable");
    img.dataset.date = date;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const moveLeftButton = document.createElement("button");
    moveLeftButton.textContent = "◀";
    moveLeftButton.classList.add("move-button", "move-left");
    moveLeftButton.addEventListener("click", () => moveImage(imageWrapper, -1));

    const moveRightButton = document.createElement("button");
    moveRightButton.textContent = "▶";
    moveRightButton.classList.add("move-button", "move-right");
    moveRightButton.addEventListener("click", () => moveImage(imageWrapper, 1));

    buttonsContainer.appendChild(moveLeftButton);
    buttonsContainer.appendChild(moveRightButton);

    // Mostrar modal al hacer clic en la imagen
    img.addEventListener("click", () => showImageModal(img, date));

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(buttonsContainer);
    gameContainer.appendChild(imageWrapper);
});

// Función para mostrar el modal con la imagen
function showImageModal(img, date) {
    const modalImageText = document.getElementById("modalImageText");
    document.getElementById("modalImage").src = img.src;
    modalImageText.textContent = `Fecha: ${date}`;
    modalImageText.classList.remove("revealed"); // Aseguramos que comience censurado
    imageModal.show();
}

// Revelar la fecha al hacer clic o tocar el texto
document.getElementById("modalImageText").addEventListener("click", revealText);
document.getElementById("modalImageText").addEventListener("touchend", revealText);

function revealText(e) {
    e.target.classList.add("revealed");
}

// Función para mover imágenes
function moveImage(imageWrapper, direction) {
    const parent = gameContainer;
    const children = Array.from(parent.children);
    const currentIndex = children.indexOf(imageWrapper);

    if (direction === -1 && currentIndex > 0) {
        // Mover a la izquierda
        parent.insertBefore(imageWrapper, children[currentIndex - 1]);
    } else if (direction === 1 && currentIndex < children.length - 1) {
        // Mover a la derecha
        parent.insertBefore(imageWrapper, children[currentIndex + 2]);
    }
}

// Verificar el orden
checkOrderButton.addEventListener("click", () => {
    const currentOrder = Array.from(gameContainer.children).map(
        (imgWrapper) => imgWrapper.dataset.date
    );

    if (JSON.stringify(currentOrder) === JSON.stringify(dates)) {
        const successModal = new bootstrap.Modal(document.getElementById("successModal"));
        successModal.show();
        successAudio.currentTime = 0;
        successAudio.play();
    } else {
        const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
        errorModal.show();
        errorAudio.currentTime = 0;
        errorAudio.play();
    }
});
