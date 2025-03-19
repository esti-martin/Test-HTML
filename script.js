document.addEventListener("DOMContentLoaded", function () {
    let preguntas = []; // Variable para almacenar las preguntas

    fetch("preguntas.json") // Carga el JSON
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            preguntas = data;
            console.log("Preguntas cargadas:", preguntas); // Mensaje de depuración
            iniciarQuiz(); // Llamar a la función que inicia el test
        })
        .catch((error) => console.error("Error cargando JSON:", error));

    function iniciarQuiz() {
        let preguntasRealizadas = JSON.parse(localStorage.getItem("preguntasRealizadas")) || [];

        // Si no hay preguntas guardadas, seleccionar aleatoriamente 10
        if (preguntasRealizadas.length === 0) {
            preguntasRealizadas = seleccionarPreguntasAleatorias(preguntas, 10);
            localStorage.setItem("preguntasRealizadas", JSON.stringify(preguntasRealizadas));
        }

        console.log("Preguntas realizadas al iniciar:", preguntasRealizadas); // Mensaje de depuración
        mostrarPregunta(0);
    }  // Fin de la función iniciarQuiz

    function seleccionarPreguntasAleatorias(lista, cantidad) {
        let preguntasSeleccionadas = lista.sort(() => Math.random() - 0.5).slice(0, cantidad);
        return preguntasSeleccionadas;
    }

    let indicePreguntaActual = 0;
    let puntuacion = localStorage.getItem("puntuacion") ? parseInt(localStorage.getItem("puntuacion")) : 0;

    function mostrarPregunta(indice) {
        let preguntasRealizadas = JSON.parse(localStorage.getItem("preguntasRealizadas")) || [];
        console.log("Mostrando pregunta:", indice, preguntasRealizadas); // Mensaje de depuración

        if (indice >= preguntasRealizadas.length) {
            mostrarResultados();
            return;
        }

        let pregunta = preguntasRealizadas[indice];
        console.log("Pregunta actual:", pregunta); // Mensaje de depuración

        // Punto de interrupción para depuración
        //debugger;

        let contenedor = document.getElementById("quiz");

        if (!pregunta || !pregunta.opciones) {
            console.error("Pregunta u opciones no definidas:", pregunta);
            return;
        }

        contenedor.innerHTML = `
    <h2>${pregunta.pregunta}</h2>
    <ul>
      ${pregunta.opciones.map((opcion, i) => `<li><button onclick="verificarRespuesta(${indice}, \`${opcion.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}\`)">${opcion.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</button></li>`).join("")}
    </ul>
  `;
    }

    function verificarRespuesta(indice, respuestaUsuario) {
        let preguntasRealizadas = JSON.parse(localStorage.getItem("preguntasRealizadas")) || [];
        let preguntaActual = preguntasRealizadas[indice];

        if (respuestaUsuario === preguntaActual.respuestaCorrecta) {
            puntuacion++;
            let respuestasCorrectas = JSON.parse(localStorage.getItem("respuestasCorrectas")) || [];
            respuestasCorrectas.push({ pregunta: preguntaActual.pregunta, respuestaUsuario });
            localStorage.setItem("respuestasCorrectas", JSON.stringify(respuestasCorrectas));
        } else {
            let respuestasIncorrectas = JSON.parse(localStorage.getItem("respuestasIncorrectas")) || [];
            respuestasIncorrectas.push({
                pregunta: preguntaActual.pregunta,
                respuestaUsuario,
                correcta: preguntaActual.respuestaCorrecta
            });
            localStorage.setItem("respuestasIncorrectas", JSON.stringify(respuestasIncorrectas));
        }

        localStorage.setItem("puntuacion", puntuacion);

        console.log("Preguntas realizadas después de verificar respuesta:", preguntasRealizadas); // Mensaje de depuración
        mostrarPregunta(indice + 1);
    }

    window.verificarRespuesta = verificarRespuesta; // Hacer que la función esté disponible globalmente

    function mostrarResultados() {
        let contenedorResultados = document.getElementById("resultados");
        let puntuacionTexto = document.getElementById("puntuacion");
        let listaCorrectas = document.getElementById("listaCorrectas");
        let listaIncorrectas = document.getElementById("listaIncorrectas");

        let respuestasCorrectas = JSON.parse(localStorage.getItem("respuestasCorrectas")) || [];
        let respuestasIncorrectas = JSON.parse(localStorage.getItem("respuestasIncorrectas")) || [];

        puntuacionTexto.innerHTML = `<strong>Puntuación Final:</strong> ${puntuacion}`;

        listaCorrectas.innerHTML = respuestasCorrectas.map(resp => `<li><strong>${resp.pregunta}</strong>: ${resp.respuestaUsuario}</li>`).join("");
        listaIncorrectas.innerHTML = respuestasIncorrectas.map(resp => `<li><strong>${resp.pregunta}</strong>: ${resp.respuestaUsuario} (Correcta: ${resp.correcta})</li>`).join("");

        document.getElementById("quiz").style.display = "none"; // Ocultar el quiz
        contenedorResultados.style.display = "block"; // Mostrar resultados
    }

    function reiniciarTest() {
        localStorage.clear();
        location.reload();
    }
});