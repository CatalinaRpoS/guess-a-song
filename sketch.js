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
let color = 155;
let noise;
let isShowing = false;

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

    myShader = loadShader("shaders/shader.vert", "shaders/shader.frag");

    noise = loadImage("noise.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    angleMode(DEGREES);

    //let marginPercentage = 5;
    //let marginX = (windowWidth * marginPercentage) / 100;
    //let marginY = (windowHeight * marginPercentage) / 100;

    puntosParrafo = createP(puntos + "/12"); 
    //puntosParrafo.position(windowWidth - (windowWidth - 1500), windowHeight - (windowHeight-60)); 
    //puntosParrafo.position(marginX, marginY);
    puntosParrafo.style('position', 'fixed');
    puntosParrafo.style('top', '-5%');
    puntosParrafo.style('right', '5%');
    puntosParrafo.style("text-shadow", "2px 2px 4px rgba(0, 0, 0, 0.3)");
    puntosParrafo.style("font-size", "60px"); 
    puntosParrafo.style("font-family", "Verdana");
    puntosParrafo.style("font-weight", "700");
    //puntosParrafo.style("font-family", "papyrus");
    puntosParrafo.style("color", "white"); 
    puntosParrafo.style("padding", "10px"); 
    puntosParrafo.style("border-radius", "5px"); 
    background(color);

    speechRec = new p5.SpeechRec('es-ES');
    speechRec.continuous = true; // Habilitar reconocimiento de voz continuo
    speechRec.interimResults = true; // Habilitar resultados intermedios
    speechRec.onResult = gotSpeech;
    //speechRec.start();

    amplitud = new p5.Amplitude();
    fft = new p5.FFT();

    // Crear botón para activar y desactivar el reconocimiento de voz
    let activateButton = createButton("Quiero hablar");
    activateButton.position(windowWidth - (windowWidth - 50), windowHeight - (windowHeight-50));
    activateButton.mousePressed(activateRecognition);
    //Estilización del botón
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
    color = 0;
    speechRec.start(); // Iniciar el reconocimiento de voz
    isListening = true;
  } else {
    color = 155;
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

  background(color);

  shader(myShader);
  myShader.setUniform("uFrameCount", frameCount);

  let wave = fft.waveform();
  let level = amplitud.getLevel();

  // Pasamos la amplitud al shader
  // myShader.setUniform("uLevel", level);

  // Condiciones para reproducir y detener canciones
  if (speechValue == "para" && isPlaying){
    parar();
  } else if (speechValue == "siguiente" && !isPlaying) {
    empezar();
    // Send the frameCount to the shader
    // myShader.setUniform("uFrameCount", frameCount);
    // myShader.setUniform("uNoiseTexture", noise);

    // Rotate our geometry on the X and Y axes
    // rotateX(frameCount * 0.01);
    // rotateY(frameCount * 0.005);
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

  // Reconocimiento del título de la canción

  if (speechValue == canciones[auxiliar][1]) {
    console.log("Correcto");
    puntos = puntos + 1;  
    parar();
    empezar();
    puntosParrafo.html(puntos + "/12");
    console.log(puntos);
  }

  /*if (index % 2 == 0){
    firstVisualizer(level);
  } else {
    secondVisualizer(wave);
    // shader() sets the active shader with our shader
    //shader(myShader);
      // Send the frameCount to the shader
    //myShader.setUniform("uFrameCount", frameCount);

    // Rotamos la figura en función del tiempo y la amplitud del audio
    //rotateX(frameCount * 0.01 + level);
    //rotateY(frameCount * 0.005 + level);

    // Draw some geometry to the screen
  // We're going to tessellate the sphere a bit so we have some more geometry to work with
    //sphere(width / 7, 200, 200);
  } */

  if (isShowing) {
    fill(255);    
    
    rotateX(frameCount * level);
    rotateY(frameCount * level);
    sphere(width / 7, 200, 200);
  } else {
    stroke(255);
    strokeWeight(3);
    noFill();
  
    for (let t = -1; t <= 1; t += 2) {
      beginShape();
      for (let i = 0; i <= 180; i += 1) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1));
        let r = map(wave[index], -1, 1, 150, 350);
        vertex(r * sin(i) * t, r * cos(i)* t);
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
