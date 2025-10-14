document.addEventListener('DOMContentLoaded', () => {
    let currentMusic = null; // referência da música de fundo
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

    // --- Música principal (corrigido para mobile) ---
    buttons.start.addEventListener('click', async () => {
        try {
            // Cria o áudio dentro do clique (mobile safe)
            currentMusic = new Audio('audios/musica.mp3');
            currentMusic.volume = 0.8;
            currentMusic.loop = true; // deixa a música de fundo contínua

            const playPromise = currentMusic.play();
            if (playPromise !== undefined) {
                await playPromise;
                console.log("🎶 Música tocando!");
            }
        } catch (e) {
            console.warn("🔇 Reprodução bloqueada:", e);
            alert("Se o som não tocar, toque novamente ❤️");
        }

        showSection('reasons');
        createFallingHearts();
    });

    // --- Troca de seções ---
    buttons.showPhotos.addEventListener('click', () => {
        showSection('photos');
    });

    buttons.showLetter.addEventListener('click', () => {
        showSection('letter');
    });

    // --- Toque final (voz) ---
    buttons.playAudio.addEventListener('click', async () => {
        try {
            // Pausa a música de fundo, se estiver tocando
            if (currentMusic && !currentMusic.paused) {
                currentMusic.pause();
            }

            // Reproduz a mensagem de voz
            voiceMessage.currentTime = 0;
            await voiceMessage.play();

            buttons.playAudio.textContent = "Ouvindo...";
            buttons.playAudio.disabled = true;

            // Quando terminar, volta a música de fundo
            voiceMessage.onended = () => {
                buttons.playAudio.textContent = "Reproduzir novamente 🔊";
                buttons.playAudio.disabled = false;
                if (currentMusic) {
                    currentMusic.play();
                }
            };

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
