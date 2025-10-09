document.addEventListener('DOMContentLoaded', () => {
    // Pega os elementos
    const backgroundMusic = document.getElementById('backgroundMusicPlayer');
    const voiceMessage = new Audio('audios/audio.niver.mp3');
    const musicLoader = document.getElementById('music-loader');

    createFallingHearts();

    // LÓGICA DE CONTINUIDADE DA MÚSICA
    if (sessionStorage.getItem('musicStarted') === 'true' && backgroundMusic) {
        if (musicLoader) musicLoader.style.display = 'block'; // MOSTRA o loader

        const savedTime = parseFloat(sessionStorage.getItem('musicCurrentTime') || 0);
        backgroundMusic.currentTime = savedTime;

        backgroundMusic.play().catch(error => {
            console.log("Música aguardando interação.");
            if (musicLoader) musicLoader.style.display = 'none'; // Esconde se der erro
        });
    }

    // --- OUVINTES DE EVENTOS ---

    // NOVO: Quando a música de fato começar a tocar, ESCONDE o loader
    if (backgroundMusic) {
        backgroundMusic.addEventListener('playing', () => {
            if (musicLoader) musicLoader.style.display = 'none';
        });
    }
    
    // O resto do código permanece o mesmo...

    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
            sessionStorage.removeItem('musicCurrentTime'); 
            if (backgroundMusic) {
                if (musicLoader) musicLoader.style.display = 'block';
                backgroundMusic.currentTime = 0;
                backgroundMusic.play().catch(error => console.error("Erro ao tentar tocar música:", error));
                sessionStorage.setItem('musicStarted', 'true');
            }
            window.location.href = 'reasons.html';
        });
    }

    const showPhotosButton = document.getElementById('showPhotosButton');
    if (showPhotosButton) {
        showPhotosButton.addEventListener('click', () => window.location.href = 'photos.html');
    }

    const showLetterButton = document.getElementById('showLetterButton');
    if (showLetterButton) {
        showLetterButton.addEventListener('click', () => window.location.href = 'letter.html');
    }

    const playAudioButton = document.getElementById('playAudioButton');
    if (playAudioButton) {
        playAudioButton.addEventListener('click', () => {
            if (backgroundMusic) backgroundMusic.pause();
            sessionStorage.removeItem('musicStarted');
            sessionStorage.removeItem('musicCurrentTime');
            voiceMessage.play().catch(error => console.error("Erro ao tocar mensagem de voz:", error));
            playAudioButton.textContent = "Ouvindo...";
            playAudioButton.disabled = true;
        });
    }
});

window.addEventListener('beforeunload', () => {
    const backgroundMusic = document.getElementById('backgroundMusicPlayer');
    if (backgroundMusic && !backgroundMusic.paused) {
        sessionStorage.setItem('musicCurrentTime', backgroundMusic.currentTime);
    }
});

function createFallingHearts() {
    if (document.body.dataset.heartsStarted) return;
    document.body.dataset.heartsStarted = "true";
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerText = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.top = '-10vh';
        heart.style.fontSize = `${Math.random() * 15 + 10}px`;
        heart.style.opacity = Math.random() * 0.6 + 0.1;
        heart.style.animation = `fall 10s linear`;
        heart.style.zIndex = -1;
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 10000);
    }, 800);
}
const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes fall { to { transform: translateY(110vh) rotate(360deg); opacity: 0; } }`;
document.head.appendChild(styleSheet);