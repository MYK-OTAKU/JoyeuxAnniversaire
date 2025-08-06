import { initFireworks } from './fireworks.js';

function initFloatingHearts() {
    const createHeart = () => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = '♥';

        heart.style.left = `${Math.random() * 100}vw`;
        const duration = Math.random() * 8 + 7;
        heart.style.animationDuration = `${duration}s`;
        const size = Math.random() * 12 + 12;
        heart.style.fontSize = `${size}px`;
        heart.style.filter = `blur(${Math.random() * 1.5}px)`;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    };

    setInterval(createHeart, 400);
}


document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const titleElement = document.getElementById('main-title');
    const messageContainer = document.getElementById('message-container');
    const cakeContainer = document.getElementById('cake-container');

    const musicControl = document.getElementById('music-control');
    const audio = document.getElementById('bg-music');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (musicControl && audio && playIcon && pauseIcon) {
        musicControl.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(error => console.error("Audio play failed:", error));
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                audio.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        });
    }

    initFireworks();
    initFloatingHearts();

    const typeLine = (line, element) => {
        return new Promise(resolve => {
            let i = 0;
            element.classList.add('cursor');
            const interval = setInterval(() => {
                element.textContent += line[i];
                i++;
                if (i >= line.length) {
                    clearInterval(interval);
                    element.classList.remove('cursor');
                    resolve();
                }
            }, 60);
        });
    };

    const showMessage = async (lines) => {
        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (line) {
                const p = document.createElement('p');
                p.className = "opacity-0 transition-opacity duration-500";
                messageContainer.appendChild(p);

                await new Promise(res => setTimeout(res, 100));
                p.classList.remove('opacity-0');

                await typeLine(line, p);
                
                await new Promise(res => setTimeout(res, 500));
            }
        }
    };

    const startExperience = async () => {
        try {
            const response = await fetch('birthday_message_for_touty.md');
            if (!response.ok) {
                throw new Error('Could not fetch the message.');
            }
            const text = await response.text();
            const lines = text.split('\n');

            setTimeout(() => {
                titleElement.classList.remove('opacity-0');
            }, 500);

            setTimeout(async () => {
                await showMessage(lines);
                cakeContainer.classList.remove('opacity-0', 'scale-90');
            }, 2000);

        } catch (error) {
            console.error('Error starting experience:', error);
            messageContainer.textContent = "Une erreur est survenue lors du chargement du message. Mais sache que je t'aime quand même !";
        }
    };

    startExperience();
});
