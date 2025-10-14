document.addEventListener('DOMContentLoaded', () => {
    let currentMusic = null;
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

   buttons.start.addEventListener('click', async () => {
    try {
        // Garante que o áudio seja sempre criado dentro do clique (requerido por iOS e PWA)
        if (currentMusic) {
            try { currentMusic.pause(); } catch {}
        }

        currentMusic = new Audio('audios/musica.mp3');
        currentMusic.volume = 0.8;
        currentMusic.loop = true;

        // força preload manual pra Safari standalone
        currentMusic.load();

        const playPromise = currentMusic.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => console.log("🎵 Música tocando normalmente"))
                .catch(err => {
                    console.warn("⚠️ Safari bloqueou a reprodução:", err);
                    alert("Se a música não tocar, toque novamente ❤️");
                });
        }
    } catch (e) {
        console.error("Erro ao iniciar música:", e);
        alert("Toque novamente se o som não iniciar ❤️");
    }

    showSection('reasons');
    createFallingHearts();
});

    // --- Navegação entre seções ---
    buttons.showPhotos.addEventListener('click', () => showSection('photos'));
    buttons.showLetter.addEventListener('click', () => showSection('letter'));

    // --- Toque final ---
    buttons.playAudio.addEventListener('click', async () => {
        try {
            // Pausa música de fundo se estiver tocando
            if (currentMusic && !currentMusic.paused) {
                currentMusic.pause();
            }

            // Toca mensagem de voz
            voiceMessage.currentTime = 0;
            await voiceMessage.play();

            buttons.playAudio.textContent = "Ouvindo...";
            buttons.playAudio.disabled = true;

            // Quando o áudio termina
            voiceMessage.onended = () => {
                buttons.playAudio.textContent = "Tocar música novamente 🎵";
                buttons.playAudio.disabled = false;

                // Cria uma nova interação segura no clique
                buttons.playAudio.onclick = async () => {
                    try {
                        // Cria um novo player (requerido para iOS)
                        currentMusic = new Audio('audios/musica.MP3');
                        currentMusic.volume = 0.8;
                        currentMusic.loop = true;
                        await currentMusic.play();
                        console.log("🎵 Música retomada!");
                        buttons.playAudio.textContent = "A música voltou 💖";
                        buttons.playAudio.disabled = true;
                    } catch (err) {
                        alert("Toque novamente se a música não iniciar ❤️");
                        console.error(err);
                    }
                };
            };
        } catch (e) {
            console.error("Erro ao tocar mensagem de voz:", e);
            alert("Toque novamente se o áudio não iniciar 🔊");
        }
    });
});

// --- Corações caindo ---
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
