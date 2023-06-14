// Variable para el reconocimiento de voz
let speechRec;
// Array dinámico con las canciones
let canciones = [];
// Variable para guardar el resultado del reconocimiento de voz
let speechValue = "";
// Variables para pasar entre canciones
let index = 0;
let auxiliar = 11;
let isPlaying = false;
let myShader;
let amplitud;
let fft;
let isListening = false;
let noise;
let isShowing = false;
let soundPlayed = true;
let energy;
let background_1;
let background_2;

function preload() {
    
    soundFormats('mp3');
    canciones.push([loadSound("sound_files/camisanegra"),"la camisa negra"]);
    canciones.push([loadSound("sound_files/lamentoboliviano"),"lamento boliviano"]);
    canciones.push([loadSound("sound_files/sodaestereo"),"de música ligera"]);
    canciones.push([loadSound("sound_files/labiosrotos"),"labios rotos"]); 
    canciones.push([loadSound("sound_files/enalgunlugar"),"en algún lugar"]);
    canciones.push([loadSound("sound_files/devuelvemeamichica"),"devuélveme a mi chica"]); 
    canciones.push([loadSound("sound_files/hijodelaluna"),"hijo de la luna"]);
    canciones.push([loadSound("sound_files/rosas"),"rosas"]); 
    canciones.push([loadSound("sound_files/milhoras"),"1000 horas"]);
    canciones.push([loadSound("sound_files/trenalsur"),"tren al sur"]); 
    canciones.push([loadSound("sound_files/colgandoentusmanos"),"colgando en tus manos"]);
    canciones.push([loadSound("sound_files/tabacochanel"),"tabaco y chanel"]); 

    wrong_ans = loadSound("sound_files/wrongsound");
    correct_ans = loadSound("sound_files/correctsound");

    myShader = loadShader("shaders/shader.vert", "shaders/shader.frag");
    background_1 = loadImage("images/background_1.png");
    background_2 = loadImage("images/background_2.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    angleMode(DEGREES);
    imageMode(CENTER);

    amplitud = new p5.Amplitude();
    fft = new p5.FFT();

    background_1.filter(BLUR, 12);
    background_2.filter(BLUR, 12);

    puntosParrafo = createP(puntos + "/12"); 
    puntosParrafo.style('position', 'fixed');
    puntosParrafo.style('top', '-5%');
    puntosParrafo.style('right', '5%');
    puntosParrafo.style("text-shadow", "2px 2px 4px rgba(0, 0, 0, 0.3)");
    puntosParrafo.style("font-size", "60px"); 
    puntosParrafo.style("font-family", "Verdana");
    puntosParrafo.style("font-weight", "700");
    puntosParrafo.style("color", "white"); 
    puntosParrafo.style("padding", "10px"); 
    puntosParrafo.style("border-radius", "5px"); 

    background(0);
    
    speechRec = new p5.SpeechRec('es-ES');
    speechRec.continuous = true; // Habilitar reconocimiento de voz continuo
    speechRec.interimResults = false; // Habilitar resultados intermedios
    speechRec.onResult = gotSpeech;
  
    // Crear botón para activar y desactivar el reconocimiento de voz
    activateButton = createButton("No te escucho");
    activateButton.position(windowWidth - (windowWidth - 50), windowHeight - (windowHeight-50));
    activateButton.mousePressed(activateRecognition);

    // Estilización del botón
    activateButton.style("background-image", "linear-gradient(135deg, #f34079 40%, #fc894d)");
    activateButton.style("border", 0);
    activateButton.style("align-items", "center");
    activateButton.style("border-radius", "10px");
    activateButton.style("box-sizing", "border-box");
    activateButton.style("display", "flex");
    activateButton.style("flex-direction", "column");
    activateButton.style("color", "#fff");
    activateButton.style("cursor", "pointer");
    activateButton.style("font-family", "Verdana");
    activateButton.style("font-size", "16px");
    activateButton.style("font-weight", "700");
    activateButton.style("height", "54px");
    activateButton.style("line-height", "1");
    activateButton.style("width", "200px")
    activateButton.style("justify-content", "center");
    activateButton.style("text-transform", "uppercase");

    
}

function activateRecognition() {
  if (!isListening) {
    speechRec.start(); // Iniciar el reconocimiento de voz
    isListening = true;
  } else {
    speechRec.stop(); // Detener el reconocimiento de voz
    isListening = false;
  }
}

function gotSpeech() {
  speechValue = speechRec.resultString;
  if (speechValue) {
    speechValue = speechValue.replace(".", "");
    speechValue = speechValue.toLowerCase();
    console.log(speechValue);
  }
}
puntos = 0; 
function draw() {

  background(0);

  fft.analyze();
  energy = fft.getEnergy(20, 200);

  if (!isListening) {
    activateButton.html("No te escucho");
  } else {
    activateButton.html("Te escucho");
  }

  shader(myShader);
  myShader.setUniform("uFrameCount", frameCount);

  let wave = fft.waveform();
  let level = amplitud.getLevel();

  // Condiciones para reproducir y detener canciones
  if (speechValue == "para" && isPlaying){
    soundPlayed = false;
    parar();
  } else if (speechValue == "siguiente" && !isPlaying) {
    soundPlayed = false;
    empezar();

  // Reconocimiento del título de la canción
  } else if (speechValue == canciones[auxiliar][1]) {
    puntos = puntos + 1;  
    parar();
    correct_ans.play();
    empezar();
    puntosParrafo.html(puntos + "/12");
    console.log(puntos);
    soundPlayed = false;
  } else if (auxiliar == 0 && isPlaying) {
    if (speechValue != canciones[canciones.length - 1][1] && speechValue != canciones[auxiliar][1] && speechValue != "incorrecto" && speechValue != "para" && speechValue != "siguiente" && speechValue != undefined && speechValue.length != 0) {
      if (!soundPlayed) {
        wrong_ans.play();
        soundPlayed = true; // Establecer la variable de estado a true para indicar que el sonido se reprodujo
      }
    }
  } else if (auxiliar != 0 && isPlaying) {
    if (speechValue != canciones[auxiliar][1] && speechValue != canciones[auxiliar-1][1] && speechValue != "incorrecto" && speechValue != "para" && speechValue != "siguiente" && speechValue != undefined && speechValue.length != 0) {
      if (!soundPlayed) {
        wrong_ans.play();
        soundPlayed = true; // Establecer la variable de estado a true para indicar que el sonido se reprodujo
      }
    }
  } 

  // Texto auxiliar para una respuesta incorrecta
  if (soundPlayed) {
    speechValue = "incorrecto";
  }

  // Posibilidad de volver a intentar adivinar el nombre de la canción
  if (speechValue == "incorrecto") {
    soundPlayed = false;
  }

  // Cambio de índice para comenzar nuevamente
  if (index == canciones.length || index == 0){
    index = 0;
    auxiliar = 11;
  }  

  if (canciones[auxiliar][1] == canciones[0][1]) {
    puntos = 0;
    puntosParrafo.html(puntos + "/12");
  }

  if (isShowing) {
    push();
    if (energy > 200) {
      rotate(random(-0.5, 0.5));
    }
    image(background_2, 0, 0, width + 100, height + 100);
    pop();

    fill(255);    
    
    rotateX(frameCount * level);
    rotateY(frameCount * level);
    sphere(width / 7, 200, 200);

  } else {
    push();
    if (energy > 200) {
      rotate(random(-0.5, 0.5));
    }
    image(background_1, 0, 0, width + 100, height + 100);
    pop();

    stroke(255);
    strokeWeight(5);
    noFill();
  
    for (let t = -1; t <= 1; t += 2) {
      beginShape();
      for (let i = 0; i <= 180; i += 1) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1));
        let amplitude = map(wave[index], -1, 1, 0.2, 1.0); // Ajuste del mapeo de amplitud
        let r = map(amplitude, 0.2, 1.0, 150, 350); // Ajuste del mapeo de radio
        vertex(r * sin(i) * t, r * cos(i) * t);
      }
      endShape();
    }
  }
}

function parar() {
  canciones[auxiliar][0].pause();
  isPlaying = false;
}

function empezar() {
  canciones[index][0].play();
  auxiliar = index;
  index += 1;
  isPlaying = true;
  isShowing = !isShowing;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
