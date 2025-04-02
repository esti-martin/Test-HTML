import { calculateScore } from './utils.js';
import { startCelebration } from './animations.js';

let score = 0; // Declarar en el ámbito global
let selectedQuestions = []; // Declarar en el ámbito global

// Función para escapar caracteres especiales en HTML
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('quiz');
    const questionElement = document.getElementById('question');
    const answerElements = document.querySelectorAll('.answer');
    const submitButton = document.getElementById('submit');
    const feedbackCorrect = document.getElementById('correct');
    const feedbackIncorrect = document.getElementById('incorrect');
    const resultadosContainer = document.getElementById('resultados');
    const puntuacionElement = document.getElementById('puntuacion');
    const listaCorrectas = document.getElementById('listaCorrectas');
    const listaIncorrectas = document.getElementById('listaIncorrectas');
    const reiniciarButton = document.getElementById('reiniciar');
    const otroTestButton = document.getElementById('otroTest'); // Nuevo botón
    const testTitle = document.getElementById('test-title'); // Título del test
    const questionCounter = document.getElementById('question-counter'); // Contador de preguntas

    //Obtener el parámetro 'type' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const testType = urlParams.get('type'); // 'html', 'css', o 'form'

    // Asegurarse de que testType tenga un valor válido
    if (!testType) {
        console.error('No se proporcionó un tipo de test válido en la URL.');
        testTitle.innerText = 'Test no especificado';
        return;
    }

    // Actualizar el título del test
    testTitle.innerText = `Test de ${testType.toUpperCase()}`;

    // Evento para redirigir al usuario a la pantalla de selección de test
    otroTestButton.addEventListener('click', () => {
        window.location.href = './index.html';
    });

    let questions = [];
    let currentQuestionIndex = 0;
    //let score = 0;
    //let selectedQuestions = [];

    // Determinar el archivo JSON a cargar
    let jsonFile = './resources/preguntas-CSS.json'; // Por defecto, CSS
    if (testType === 'html') {
        jsonFile = './resources/preguntas-HTML.json';
    } else if (testType === 'form') {
        jsonFile = './resources/preguntas-FORM.json';
    } else {
        console.error('Tipo de test no válido. Se cargará el test de CSS por defecto.');
    }

    // Mostrar el tipo de test en la consola para depuración
    console.log('Tipo de test:', testType);
    console.log('Archivo JSON a cargar:', jsonFile);

    // Cargar el archivo JSON correspondiente
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            questions = data;
            selectRandomQuestions();
            loadQuestion();
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });

    function selectRandomQuestions() {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, 10); // Selecciona 10 preguntas aleatorias
        console.log('Preguntas seleccionadas:', selectedQuestions); // Depuración
    }


    // Actualizar la función loadQuestion para usar escapeHTML
    function loadQuestion() {
        resetState();

        const currentQuestion = selectedQuestions[currentQuestionIndex];
        if (!currentQuestion) {
            console.error('La pregunta actual no está definida.');
            return;
        }

        // Actualizar el título del test con el contador de preguntas
        if (questionCounter) {
            questionCounter.innerText = `(${currentQuestionIndex + 1}/${selectedQuestions.length})`;
        } else {
            console.warn('El elemento #question-counter no existe en el DOM.');
        }

        // Mostrar la pregunta y las respuestas
        questionElement.innerText = escapeHTML(currentQuestion.question);
        answerElements.forEach((answerElement, index) => {
            answerElement.nextElementSibling.innerHTML = escapeHTML(currentQuestion.answers[index]);
        });
    }

    function resetState() {
        feedbackCorrect.style.display = 'none';
        feedbackIncorrect.style.display = 'none';
        answerElements.forEach(answer => {
            answer.checked = false;
        });
    }

    function ControllAnswer() {
        const selectedAnswer = Array.from(answerElements).find(answer => answer.checked);
        if (!selectedAnswer) {
            alert('Por favor, selecciona una respuesta antes de continuar.');
            return false; // Detener la ejecución si no hay respuesta seleccionada
        }

        const answerIndex = Array.from(answerElements).indexOf(selectedAnswer);
        const currentQuestion = selectedQuestions[currentQuestionIndex];

        if (!currentQuestion) {
            console.error('La pregunta actual no está definida.');
            return false; // Detener la ejecución si no hay pregunta actual
        }

        currentQuestion.userAnswer = answerIndex; // Guardar la respuesta del usuario

        if (currentQuestion.correctAnswer === answerIndex) {
            feedbackCorrect.style.display = 'block';
        } else {
            feedbackIncorrect.style.display = 'block';
        }

        return true; // Indicar que la respuesta fue procesada correctamente
    }

    submitButton.addEventListener('click', () => {
        const isAnswerProcessed = ControllAnswer();
        if (isAnswerProcessed) {
            currentQuestionIndex++;
            if (currentQuestionIndex < selectedQuestions.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }
    });

    function showResults() {
        questionContainer.style.display = 'none';
        resultadosContainer.style.display = 'block';

        // Recopilar respuestas del usuario y correctas
        const userAnswers = selectedQuestions.map(q => q.userAnswer);
        const correctAnswers = selectedQuestions.map(q => q.correctAnswer);

        // Calcular puntaje usando calculateScore
        score = calculateScore(userAnswers, correctAnswers);

        puntuacionElement.innerHTML = `<strong class="puntuacion-azul">${score} de ${selectedQuestions.length}</strong>`;

        // Verificar si todas las respuestas son correctas
        if (score === selectedQuestions.length) {
            startCelebration(); // Llamar a la función de celebración
        }
        // Mostrar mensaje de felicitaciones o de ánimo     
        const messageElement = document.createElement('p');
        if (score === selectedQuestions.length) {
            messageElement.innerText = '¡Felicidades! Has respondido todas las preguntas correctamente.';
            messageElement.classList.add('correct-message'); // Clase para mensaje de éxito
        } else {
            messageElement.innerText = '¡Buen intento! Sigue practicando para mejorar.';
            messageElement.classList.add('incorrect-message'); // Clase para mensaje de ánimo
        }

        // Guardar el resultado del test en localStorage
        const testResults = JSON.parse(localStorage.getItem('testResults')) || [];
        testResults.push({ score, total: selectedQuestions.length });
        localStorage.setItem('testResults', JSON.stringify(testResults));

        // Calcular el promedio de respuestas correctas
        const totalTests = testResults.length;
        const totalCorrectAnswers = testResults.reduce((sum, test) => sum + test.score, 0);
        const averageScore = (totalCorrectAnswers / (totalTests * selectedQuestions.length)) * 100;

        // Mostrar el promedio en la pantalla de resultados
        const promedioElement = document.createElement('p');
        promedioElement.innerText = `Promedio de respuestas correctas: ${averageScore.toFixed(2)}% (${totalTests} tests realizados)`;
        resultadosContainer.prepend(promedioElement);

        // Obtener la fecha y hora actuales
        const now = new Date();
        const formattedDate = now.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const formattedTime = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        // Mostrar la fecha y hora en el contenedor de resultados
        const fechaHoraElement = document.createElement('p');
        fechaHoraElement.innerText = `Fecha y hora del test: ${formattedDate} ${formattedTime}`;
        resultadosContainer.prepend(fechaHoraElement);

        // Limpiar listas de respuestas correctas e incorrectas
        listaCorrectas.innerHTML = '';
        listaIncorrectas.innerHTML = '';

        // Mapeo de letras a índices
        const letterToIndex = { a: 0, b: 1, c: 2, d: 3 };

        // Mostrar questions con sus respuestas correctas e incorrectas
        selectedQuestions.forEach((question, index) => {
            const listItem = document.createElement('li');
            const correctIndex = letterToIndex[question.correctAnswer]; // Convertir letra a índice
            const userAnswerText = escapeHTML(question.answers[question.userAnswer] || 'Sin respuesta');
            const correctAnswerText = escapeHTML(question.answers[correctIndex]);

            // Crear un contenedor para la pregunta
            const questionTitle = document.createElement('span');
            questionTitle.innerText = `Pregunta ${index + 1}: ${escapeHTML(question.question)}`;
            questionTitle.style.cursor = 'pointer';
            questionTitle.addEventListener('click', () => {
                // Alternar la visibilidad de las respuestas
                if (listItem.querySelector('.answers')) {
                    const answersContainer = listItem.querySelector('.answers');
                    answersContainer.style.display = answersContainer.style.display === 'none' ? 'block' : 'none';
                }
            });

            // Crear un contenedor para las respuestas
            const answersContainer = document.createElement('div');
            answersContainer.classList.add('answers');
            answersContainer.style.display = 'none'; // Ocultar por defecto

            if (question.userAnswer === correctIndex) {
                answersContainer.innerHTML = `
                    <span class="icon">✔️</span> Respuesta correcta: <strong>${correctAnswerText}</strong>`;
                listItem.classList.add('correct'); // Clase para respuestas correctas
            } else {
                answersContainer.innerHTML = `
                    <span class="icon">❌</span> Tu respuesta: <strong>${userAnswerText}</strong><br>
                    <span class="icon">✔️</span> <strong style="color: green;">Respuesta correcta: ${correctAnswerText}</strong>`; // Respuesta correcta en azul

                listItem.classList.add('incorrect'); // Clase para respuestas incorrectas
            }

            // Agregar la pregunta y las respuestas al elemento de la lista
            listItem.appendChild(questionTitle);
            listItem.appendChild(answersContainer);

            // Agregar el elemento de la lista a la lista correspondiente
            if (question.userAnswer === correctIndex) {
                listaCorrectas.appendChild(listItem);
            } else {
                listaIncorrectas.appendChild(listItem);
            }
        });
    }

    function reiniciarTest() {
        currentQuestionIndex = 0;
        score = 0;
        selectedQuestions = [];
        questionContainer.style.display = 'block';
        resultadosContainer.style.display = 'none';
        // Volver a cargar las preguntas desde el mismo archivo JSON
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                questions = data;
                selectRandomQuestions();
                loadQuestion();
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
                alert('Hubo un problema al reiniciar el test. Por favor, inténtalo de nuevo.');
            });
    }
    reiniciarButton.addEventListener('click', reiniciarTest);
    testTitle.innerText = `Test de ${testType.toUpperCase()}`;
});

export { score, selectedQuestions };