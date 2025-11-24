// Preguntas (20 máximo)
const questions = [
  { q: "¿Cuál es la capital de Francia?", options: ["París", "Londres", "Roma", "Berlín"], correct: 0 },
  { q: "¿Cuánto es 5 x 6?", options: ["11", "30", "25", "60"], correct: 1 },
  { q: "¿Quién pintó la Mona Lisa?", options: ["Picasso", "Van Gogh", "Da Vinci", "Miguel Ángel"], correct: 2 },
  { q: "¿Cuál es el planeta más grande?", options: ["Tierra", "Saturno", "Júpiter", "Marte"], correct: 2 },
  { q: "¿Cuál es el río más largo del mundo?", options: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"], correct: 0 },
  { q: "¿Quién escribió Don Quijote?", options: ["Borges", "García Márquez", "Cervantes", "Lorca"], correct: 2 },
  { q: "¿En qué continente está Egipto?", options: ["Asia", "África", "Europa", "América"], correct: 1 },
  { q: "¿Cuál es el metal más ligero?", options: ["Oro", "Aluminio", "Litio", "Hierro"], correct: 2 },
  { q: "¿Quién formuló la teoría de la relatividad?", options: ["Newton", "Einstein", "Tesla", "Copérnico"], correct: 1 },
  { q: "¿Cuánto es 9²?", options: ["81", "72", "99", "90"], correct: 0 },
  { q: "¿En qué año llegó el hombre a la luna?", options: ["1965", "1969", "1975", "1980"], correct: 1 },
  { q: "¿Qué gas respiramos para vivir?", options: ["Oxígeno", "Hidrógeno", "Nitrógeno", "Dióxido de carbono"], correct: 0 },
  { q: "¿Cuál es la capital de Japón?", options: ["Seúl", "Pekín", "Tokio", "Kioto"], correct: 2 },
  { q: "¿Qué instrumento toca un pianista?", options: ["Guitarra", "Violín", "Piano", "Batería"], correct: 2 },
  { q: "¿Quién descubrió América?", options: ["Napoleón", "Cristóbal Colón", "Magallanes", "Hernán Cortés"], correct: 1 },
  { q: "¿Cuántos planetas hay en el sistema solar?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "¿Cuál es la moneda de EE.UU.?", options: ["Peso", "Euro", "Dólar", "Yen"], correct: 2 },
  { q: "¿Qué animal es el rey de la selva?", options: ["Tigre", "León", "Elefante", "Oso"], correct: 1 },
  { q: "¿Cuál es el océano más grande?", options: ["Atlántico", "Índico", "Pacífico", "Ártico"], correct: 2 },
  { q: "¿De qué color es el sol?", options: ["Rojo", "Blanco", "Amarillo", "Naranja"], correct: 2 }
];

let currentQuestion = 0;
let port, writer;

// Inicializar Arduino
async function initArduino() {
  if ("serial" in navigator) {
    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const encoder = new TextEncoderStream();
      encoder.readable.pipeTo(port.writable);
      writer = encoder.writable.getWriter();

      console.log("✅ Conectado al Arduino");
    } catch (err) {
      console.error("❌ Error al conectar:", err);
    }
  } else {
    alert("Tu navegador no soporta Web Serial API");
  }
}

// Enviar señal a Arduino
async function sendToArduino(signal) {
  if (writer) {
    await writer.write(signal + "\n");
    console.log("Enviado:", signal);
  }
}

// Mostrar pregunta
function showQuestion() {
  if (currentQuestion >= questions.length) {
    document.getElementById("question").textContent = "🎉 ¡Has terminado el quiz!";
    document.getElementById("options").innerHTML = "";
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("question").textContent = q.q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(index === q.correct);
    optionsDiv.appendChild(btn);
  });
}

// Verificar respuesta
function checkAnswer(isCorrect) {
  const body = document.body;
  if (isCorrect) {
    document.getElementById("correct-sound").play();
    body.style.background = "green";
    sendToArduino("correcto");
  } else {
    document.getElementById("wrong-sound").play();
    body.style.background = "red";
    sendToArduino("incorrecto");
  }
  setTimeout(() => {
    body.style.background = "";
    currentQuestion++;
    showQuestion();
  }, 1000);
}

// Fondo animado caótico de cuadrados
function createSquares() {
  const bg = document.getElementById("background");
  setInterval(() => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.left = Math.random() * window.innerWidth + "px";
    square.style.width = square.style.height = Math.random() * 30 + 10 + "px";
    square.style.background = `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},0.3)`;
    square.style.animationDuration = (Math.random() * 5 + 5) + "s";

    bg.appendChild(square);

    setTimeout(() => {
      square.remove();
    }, 10000);
  }, 300);
}

// Eventos
document.getElementById("connect-btn").addEventListener("click", initArduino);

// Iniciar
createSquares();
showQuestion();
