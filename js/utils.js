function getRandomQuestions(questions, numQuestions) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
}

function calculateScore(userAnswers, correctAnswers) {
    const letterToIndex = { a: 0, b: 1, c: 2, d: 3 }; // Mapeo de letras a índices
    let score = 0;

    userAnswers.forEach((answer, index) => {
        const correctIndex = letterToIndex[correctAnswers[index]]; // Convertir letra a índice
        if (answer === correctIndex) {
            score++;
        }
    });

    return score;
}

function displayFeedback(isCorrect) {
    const feedbackElement = document.getElementById(isCorrect ? 'correct' : 'incorrect');
    feedbackElement.style.display = 'block';
    setTimeout(() => {
        feedbackElement.style.display = 'none';
    }, 2000);
}

export { getRandomQuestions, calculateScore, displayFeedback };