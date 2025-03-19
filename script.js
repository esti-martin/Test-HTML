let selectedQuestions; // Declarar selectedQuestions como variable global
let numQuestions; // Declarar numQuestions como variable global

fetch("preguntas.json")
    .then(response => response.json())
    .then(data => {
        let quizData = data; // Aquí se almacenan las preguntas
        iniciarQuiz(quizData);
    })
    .catch(error => {
        console.error("Error al cargar el archivo JSON:", error);
    });

function iniciarQuiz(quizData) {
    numQuestions = parseInt(prompt("¿Cuántas preguntas deseas responder? (Máximo 100)", "100"));
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 100) {
        alert("Por favor, ingresa un número entre 1 y 100.");
        location.reload();
    }
    selectedQuestions = quizData.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    //console.log(selectedQuestions); // Verificar que selectedQuestions se inicialice correctamente
    loadQuiz();
}

const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const correctEl = document.getElementById('correct');
const incorrectEl = document.getElementById('incorrect');
const progressBarFill = document.getElementById('progress-bar-fill');

let currentQuiz = 0;
let score = 0;
let incorrectQuestions = [];

function loadQuiz() {
    deselectAnswers();

    const currentQuizData = selectedQuestions[currentQuiz];

    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.options.find(option => option.key === 'a').text;
    b_text.innerText = currentQuizData.options.find(option => option.key === 'b').text;
    c_text.innerText = currentQuizData.options.find(option => option.key === 'c').text;
    d_text.innerText = currentQuizData.options.find(option => option.key === 'd').text;

    //correctEl.innerText = `Correctas: ${score}`;
    //incorrectEl.innerText = `Incorrectas: ${currentQuiz - score}`;

    correctEl.style.display = 'none';
    incorrectEl.style.display = 'none';

    updateProgressBar();
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
}

function getSelected() {
    let answer;

    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });

    return answer;
}

function updateProgressBar() {
    const progress = ((currentQuiz + 1) / selectedQuestions.length) * 100;
    progressBarFill.style.width = `${progress}%`;
    progressBarFill.innerText = `${Math.round(progress)}%`;
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected();

    if (answer) {
        if (answer === selectedQuestions[currentQuiz].correct) {
            score++;
            correctEl.style.display = 'block';
            incorrectEl.style.display = 'none';
            setTimeout(() => {
                currentQuiz++;
                if (currentQuiz < selectedQuestions.length) {
                    loadQuiz();
                } else {
                    quiz.innerHTML = `
                        <h2>¡Felicidades! Respondiste correctamente ${score}/${selectedQuestions.length} preguntas.</h2>
                        <button onclick="location.reload()">Reiniciar</button>
                    `;
                }
            }, 1000);
        } else {
            incorrectEl.style.display = 'block';
            correctEl.style.display = 'none';
            incorrectQuestions.push(selectedQuestions[currentQuiz]);
            setTimeout(() => {
                loadQuiz();
            }, 1000);
        }

    }
});