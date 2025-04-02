import { score, selectedQuestions } from './script.js';

// Llamar a la función cuando todas las respuestas sean correctas
export function createFireworks() {
    if (score > 0) {
        console.log(`¡Fuegos artificiales para un puntaje de ${score}!`);
        for (let i = 0; i < 5; i++) {
            const fireworkContainer = document.createElement('div');
            fireworkContainer.style.position = 'fixed';
            fireworkContainer.style.top = `${Math.random() * 50 + 25}vh`;
            fireworkContainer.style.left = `${Math.random() * 100}vw`;
            fireworkContainer.style.pointerEvents = 'none';
            document.body.appendChild(fireworkContainer);

            // Crear fuegos artificiales
            for (let j = 0; j < 10; j++) {
                const firework = document.createElement('div');
                firework.classList.add('firework');
                firework.style.setProperty('--color', `hsl(${Math.random() * 360}, 100%, 50%)`);
                firework.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
                fireworkContainer.appendChild(firework);
            }

            // Eliminar los fuegos artificiales después de 2 segundos
            setTimeout(() => {
                fireworkContainer.remove();
            }, 10000);
        }
    }
}

// Crear globos
function createBalloons() {
    const balloonContainer = document.createElement('div');
    balloonContainer.style.position = 'fixed';
    balloonContainer.style.top = '0';
    balloonContainer.style.left = '0';
    balloonContainer.style.width = '100%';
    balloonContainer.style.height = '100%';
    balloonContainer.style.pointerEvents = 'none';
    document.body.appendChild(balloonContainer);

    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.animationDelay = `${Math.random() * 5}s`;
        balloon.style.setProperty('--color', `hsl(${Math.random() * 360}, 100%, 70%)`);
        balloonContainer.appendChild(balloon);
    }

    // Eliminar los globos después de 10 segundos
    setTimeout(() => {
        balloonContainer.remove();
    }, 10000);
}

// Crear serpentinas
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.setProperty('--color', `hsl(${Math.random() * 360}, 100%, 50%)`);
        confettiContainer.appendChild(confetti);
    }

    /* Eliminar las serpentinas después de 10 segundos
    setTimeout(() => {
        confettiContainer.remove();
    }, 10000);*/
}

// Función principal para combinar las animaciones
export function startCelebration() {
    createFireworks();
    createBalloons();
    createConfetti();
}