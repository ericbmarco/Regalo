const dates = [
    "20241009", "20241013", "20241021",
    "20241023", "20241029", "20241101", "20241102", "20241104", "20241112", 
    "20241113", "20241114", "20241119"
];
// const dates = ['202410081'];
const shuffledDates = [...dates].sort(() => Math.random() - 0.5);

const gameContainer = document.getElementById("game");
const checkOrderButton = document.getElementById("check-order");
const imageModal = new bootstrap.Modal(document.getElementById("imageModal"));

// Cargar imágenes de forma aleatoria
shuffledDates.forEach((date) => {
    const img = document.createElement("img");
    img.src = `img/${date}.jpg`; // Cambia a la ruta donde guardes tus imágenes
    img.alt = `Imagen con fecha ${date}`;
    img.classList.add("draggable");
    img.draggable = true;
    img.dataset.date = date;
    gameContainer.appendChild(img);

    // Mostrar modal al hacer clic en la imagen
    img.addEventListener("click", () => {
        const modalImageText = document.getElementById("modalImageText");
        document.getElementById("modalImage").src = img.src;
        modalImageText.textContent = `Fecha: ${date}`; // Asignamos la fecha
        modalImageText.classList.remove("revealed"); // Aseguramos que comience censurado
        imageModal.show();
    });
});

// Revelar la fecha al hacer clic en el texto
document.getElementById("modalImageText").addEventListener("click", (e) => {
    e.target.classList.add("revealed"); // Revela el texto al hacer clic
});

// Drag & Drop funcionalidad
let draggedElement = null;
let currentTarget = null;

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

// Crear referencia al audio
const successAudio = new Audio("audio/crisTerie.mp3"); // Cambia la ruta al archivo MP3
const errorAudio = new Audio("audio/crisTerie.mp3"); // Cambia la ruta al archivo MP3

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

        // Reproducir la canción
        successAudio.currentTime = 0; // Asegúrate de que comience desde el inicio
        successAudio.play();
    }
});
