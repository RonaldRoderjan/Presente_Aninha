document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('backgroundMusicPlayer');
    const voiceMessage = new Audio('audios/audio.niver.mp3');

    const sections = {
        welcome: document.getElementById('welcome'),
        reasons: document.getElementById('reasons'),
        photos: document.getElementById('photos'),
        letter: document.getElementById('letter'),
    };

    const buttons = {
        start: document.getElementById('startButton'),
        showPhotos: document.getElementById('showPhotosButton'),
        showLetter: document.getElementById('showLetterButton'),
        playAudio: document.getElementById('playAudioButton'),
    };

    function showSection(sectionId) {
        Object.values(sections).forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        const sectionToShow = sections[sectionId];
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
            sectionToShow.classList.add('active');
        }
    }

    // --- Correção principal: reprodução garantida em celular ---
    buttons.start.addEventListener('click', async () => {
        try {
            const bgMusic = new Audio('audios/musica.MP3');
            bgMusic.volume = 0.8;

            const playPromise = bgMusic.play();

            if (playPromise !== undefined) {
                await playPromise;
                console.log("Musica tocando!");
            }

            window.currentMusic = bgMusic;

        } catch (e) {
            console.warn("⚠️ Reprodução bloqueada, aguardando segunda tentativa:", e);
            alert("Toque novamente se o sol não iniciar ❤️");
        }

        showSection('reasons');
        createFallingHearts();
    });

    // Mostra as fotos
    buttons.showPhotos.addEventListener('click', () => {
        showSection('photos');
    });

    // Mostra a carta
    buttons.showLetter.addEventListener('click', () => {
        showSection('letter');
    });

    // Toca a mensagem de voz final
    buttons.playAudio.addEventListener('click', async () => {
        try {
            backgroundMusic.pause();
            voiceMessage.currentTime = 0;
            await voiceMessage.play();
            buttons.playAudio.textContent = "Ouvindo...";
            buttons.playAudio.disabled = true;
        } catch (e) {
            console.error("Erro ao tocar a mensagem de voz:", e);
            alert("Toque novamente se o áudio não iniciar 🔊");
        }
    });
});

// --- Efeitos visuais (corações caindo) ---
function createFallingHearts() {
    if (document.body.dataset.heartsStarted) return;
    document.body.dataset.heartsStarted = "true";

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes fall { 
        to { transform: translateY(110vh) rotate(360deg); opacity: 0; } 
    }`;
    document.head.appendChild(styleSheet);

    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerText = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.top = '-10vh';
        heart.style.fontSize = `${Math.random() * 15 + 10}px`;
        heart.style.opacity = Math.random() * 0.6 + 0.1;
        heart.style.animation = `fall 10s linear`;
        heart.style.zIndex = -2;
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 10000);
    }, 800);
}
