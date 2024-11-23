const dates = [
    "20241009", "20241013", "20241021",
    "20241023", "20241029", "20241101", "20241102", "20241104", "20241112", 
    "20241113", "20241114", "20241119"
];
const shuffledDates = [...dates].sort(() => Math.random() - 0.5);

const gameContainer = document.getElementById("game");
const checkOrderButton = document.getElementById("check-order");
const imageModal = new bootstrap.Modal(document.getElementById("imageModal"));

// Crear referencia al audio
const successAudio = new Audio("crisTerie.mp3"); // Cambia la ruta al archivo MP3
const errorAudio = new Audio("errorSound.mp3"); // Cambia la ruta al archivo MP3

let draggedElement = null;
let touchStartX = null;
let touchStartY = null;

// Cargar imágenes de forma aleatoria
shuffledDates.forEach((date) => {
    const img = document.createElement("img");
    img.src = `${date}.jpg`; // Cambia a la ruta donde guardes tus imágenes
    img.alt = `Imagen con fecha ${date}`;
    img.classList.add("draggable");
    img.draggable = true;
    img.dataset.date = date;
    gameContainer.appendChild(img);

    // Mostrar modal al hacer clic o tocar la imagen
    img.addEventListener("click", () => showImageModal(img, date));
    img.addEventListener("touchend", () => showImageModal(img, date));
});

// Función para mostrar el modal con la imagen
function showImageModal(img, date) {
    const modalImageText = document.getElementById("modalImageText");
    document.getElementById("modalImage").src = img.src;
    modalImageText.textContent = `Fecha: ${date}`; // Asignamos la fecha
    modalImageText.classList.remove("revealed"); // Aseguramos que comience censurado
    imageModal.show();
}

// Revelar la fecha al hacer clic o tocar el texto
document.getElementById("modalImageText").addEventListener("click", revealText);
document.getElementById("modalImageText").addEventListener("touchend", revealText);

function revealText(e) {
    e.target.classList.add("revealed"); // Revela el texto al hacer clic o tocar
}

// Drag & Drop y soporte táctil
gameContainer.addEventListener("touchstart", (e) => {
    const target = e.target;
    if (target.classList.contains("draggable")) {
        draggedElement = target;
        const rect = target.getBoundingClientRect();
        touchStartX = e.touches[0].clientX - rect.left;
        touchStartY = e.touches[0].clientY - rect.top;
    }
});

gameContainer.addEventListener("touchmove", (e) => {
    if (draggedElement) {
        e.preventDefault();
        const touch = e.touches[0];
        draggedElement.style.position = "absolute";
        draggedElement.style.left = `${touch.clientX - touchStartX}px`;
        draggedElement.style.top = `${touch.clientY - touchStartY}px`;
    }
});

gameContainer.addEventListener("touchend", (e) => {
    if (draggedElement) {
        draggedElement.style.position = "static";
        draggedElement = null;
    }
});

// Drag & Drop funcionalidad con mouse
document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable")) {
        draggedElement = e.target;
        setTimeout(() => (draggedElement.style.display = "none"), 0); // Esconde temporalmente el elemento
    }
});

document.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("draggable")) {
        currentTarget = e.target;
    }
});

document.addEventListener("drop", (e) => {
    e.preventDefault();
    draggedElement.style.display = "block";
    if (currentTarget) {
        const parent = gameContainer;
        const elements = Array.from(parent.children);
        const draggedIndex = elements.indexOf(draggedElement);
        const targetIndex = elements.indexOf(currentTarget);

        if (draggedIndex > targetIndex) {
            parent.insertBefore(draggedElement, currentTarget);
        } else {
            parent.insertBefore(draggedElement, currentTarget.nextSibling);
        }
    }
    draggedElement = null;
    currentTarget = null;
});

// Verificar el orden
checkOrderButton.addEventListener("click", () => {
    const currentOrder = Array.from(gameContainer.children).map(
        (img) => img.dataset.date
    );

    if (JSON.stringify(currentOrder) === JSON.stringify(dates)) {
        const successModal = new bootstrap.Modal(document.getElementById("successModal"));
        successModal.show();

        // Reproducir la canción
        successAudio.currentTime = 0; // Asegúrate de que comience desde el inicio
        successAudio.play();

    } else {
        const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
        errorModal.show();

        // Reproducir el sonido de error
        errorAudio.currentTime = 0; // Asegúrate de que comience desde el inicio
        errorAudio.play();
    }
});
