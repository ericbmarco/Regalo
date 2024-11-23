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

let draggedElement = null;
let touchStartX = null;
let touchStartY = null;
let placeholder = null;

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

// Eventos táctiles para drag-and-drop
gameContainer.addEventListener("touchstart", (e) => {
    const target = e.target;
    if (target.classList.contains("draggable")) {
        draggedElement = target;
        placeholder = document.createElement("div");
        placeholder.classList.add("placeholder");
        placeholder.style.height = `${draggedElement.offsetHeight}px`;
        gameContainer.insertBefore(placeholder, draggedElement.nextSibling);

        const rect = target.getBoundingClientRect();
        touchStartX = e.touches[0].clientX - rect.left;
        touchStartY = e.touches[0].clientY - rect.top;
        target.style.position = "absolute";
        target.style.zIndex = "1000";
    }
});

gameContainer.addEventListener("touchmove", (e) => {
    if (draggedElement) {
        e.preventDefault();
        const touch = e.touches[0];
        draggedElement.style.left = `${touch.clientX - touchStartX}px`;
        draggedElement.style.top = `${touch.clientY - touchStartY}px`;

        const elements = Array.from(gameContainer.children).filter(
            (el) => el !== draggedElement && el !== placeholder
        );

        for (let el of elements) {
            const rect = el.getBoundingClientRect();
            if (touch.clientY > rect.top && touch.clientY < rect.bottom) {
                gameContainer.insertBefore(placeholder, el.nextSibling);
                break;
            }
        }
    }
});

gameContainer.addEventListener("touchend", (e) => {
    if (draggedElement) {
        draggedElement.style.position = "static";
        draggedElement.style.zIndex = "0";
        gameContainer.insertBefore(draggedElement, placeholder);
        placeholder.remove();
        placeholder = null;
        draggedElement = null;
    }
});

// Eventos drag-and-drop para mouse
document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable")) {
        draggedElement = e.target;
        setTimeout(() => (draggedElement.style.display = "none"), 0);
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
        successAudio.currentTime = 0;
        successAudio.play();
    } else {
        const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
        errorModal.show();
        errorAudio.currentTime = 0;
        errorAudio.play();
    }
});
