//<script src="https://cdn.jsdelivr.net/gh/elonskolnik/p5js-music-visualizer@main/main.js 
var noteOn = false;
var note = "";
var noteY = 0;
var noteColor = "white";

var midimsgtype = 0;
var midimsg = 1;
var midivelocity = 0;
var enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8 = 0;

const numKeys = 76;
var keyboard;
const s1name = "S-1"; 
const casioName = "CASIO USB-MIDI";
const launchkeyName = "Launchkey Mini MK4 37 MIDI";

var audioIn, lvl;
const canvasX = 1180;
const canvasY = 820;

/*navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    console.log('Audio stream obtained', stream);
    const audioContext = new AudioContext();
    audioIn = audioContext.createMediaStreamSource(stream);
  })
  .catch(function(err) {
    // Handle errors
    console.error('Error accessing microphone:', err);
  });

navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
      });
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
    });
*/
navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    var inputs = midiAccess.inputs;
    inputs.forEach((input) => {
      if (input == null){
      	console.log('No MIDI devices found');
      } else{
      		console.log(`${input.name} discovered!`);
          //document.body.innerHTML = `${input.name} discovered!`;
          if (input.name == casioName || input.name == s1name || input.name == 			 launchkeyName){
            keyboard = input;
          } else{
            console.log("Keyboard not found!");
          }
      }
      /*input.onmidimessage = (message) => {
        console.log(message.data);
      };*/
	 		});
  inputs.forEach((input) => {
  if (keyboard != null){
      if(input == keyboard){
      	input.onmidimessage = getMIDImessage;
  		}
  }
  });
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

function getMIDImessage(msg){
	//console.log(msg.data);
  //document.body.innerHTML= 'MIDI message received after call';
  midimsgtype = msg.data[0];
  midimsg = msg.data[1];
  midivelocity = msg.data[2];
    
  if(midimsgtype == 144 && midivelocity > 0){
  	noteOn = true;
    midimsg -= 15;
    setNote(midimsg);
  } else noteOn = false;
  if(noteOn){
 		console.log("Note " + note + " " + midimsg + " on at " + midivelocity + " velocity\n");
    //document.body.innerHTML= `Note ${note} ${noteNum} on at ${velocity} velocity`;
  /*} else if(!Number.isNaN(midimsg)){
  	console.log("Note " + note + " " + midimsg + " off\n");*/
  }
  /*if(midimsg != undefined){
  	console.log(`MIDI Type: ${midimsgtype}\n Message: ${midimsg}\n Velocity: ${midivelocity}`);
  }*/
  
  if(midimsgtype == 179){
  	setEncoder(midimsg, midivelocity);
  }
}

function setEncoder(midimsg, midivelocity){
	switch(midimsg){
  	//21-36
  	case 21:
    	enc1 = midivelocity;
      break;
    case 22:
    	enc2 = midivelocity;
      break;
    case 23: 
    	enc3 = midivelocity;
      break;
    case 24:
    	enc4 = midivelocity;
      break;
    case 25:
    	enc5 = midivelocity;
      break;
    case 26: 
    	enc6 = midivelocity;
      break;
    case 27:
    	enc7 = midivelocity;
      break;
    case 28:
    	enc8 = midivelocity;
      break;
    default:
    	console.log("Encoder " + midimsg + " not programmed");
  }
  console.log(`Encoder ${midimsg-20} set to ${midivelocity}`);
}

function setNote(noteNum){
	var interval = canvasY/12 - 10;
	var offset = noteNum % 12;
  //console.log(`setNote ${noteNum} offset ${offset}`);
  switch(offset){
  	case 0:
    	note = 'D#';
      noteY = interval * 6;
      noteColor = "lightskyblue";
      break;
   	case 1:
    	note = 'E';
      noteY = interval * 5;
      noteColor = "magenta";
      break;
    case 2:
    	note = 'F';
      noteY = interval * 4;
      noteColor = "forestgreen";
      break;
    case 3:
    	note = 'F#';
      noteY = interval * 3;
      noteColor = "palegreen";
      break;
    case 4:
    	note = 'G';
      noteY = interval * 2;
      noteColor = "orange";
      break;
    case 5:
   		note = 'G#';
      noteY = interval;
    case 6:
    	note = 'A';
      noteY = interval * 12;
      noteColor = "purple";
      break;
    case 7:
    	note = 'A#';
      noteY = interval * 11;
      noteColor = "mediumPurple";
      break;
    case 8:
    	note = 'B';
      noteY = interval * 10;
      noteColor = "aqua";
      break;
    case 9:
    	note = 'C';
      noteY = interval * 9;
      noteColor = "red";
      break;
    case 10:
    	note = 'C#';
      noteY = interval * 8;
      noteColor = "maroon";
      break;
    case 11:
    	note = 'D';
      noteY = interval * 7;
      noteColor = "blue";
      break;
    default:
    	note = 'ERROR';
      noteY = 0;
      noteColor = 'black';
  }
}

var circleX, circleY, velocitysize = 0;
var mic, ampfft, wavefft, shapeW;
var bass, bassThreshold = 150;
var treble, mid;
var numBands = 64;
var waveBands = 1024;
var stars = [];
var numStars = 500;
var planetSize;

function preload() {
	planetTexture = loadImage('https://cdn.prod.website-files.com/63e530686f211b120ea271c6/67dc901eb178355a88e2ad62_moontexture.jpg');
  backImg = loadImage('https://cdn.prod.website-files.com/63e530686f211b120ea271c6/67dc9bda517d06b441555a12_nebula.jpg');
  ringTexture = loadImage('https://cdn.prod.website-files.com/63e530686f211b120ea271c6/67de07ac4b0b9419f91499d9_ringtexture.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);
  angleMode(DEGREES);
  smooth();
  
  loadFont('https://cdn.prod.website-files.com/63e530686f211b120ea271c6/67b67656f61615fb9e300337_Ubuntu-Medium.ttf', font => {
    fill('white');
    textFont(font, 32);
  });
  text('tap on screen', width/2, height/2);
  
  strokeWeight(2);
  noFill();
  stroke('black');
  noteColor = 'gold';
  background(0, 5, 5);
  
  getAudioContext().suspend();
  mic = new p5.AudioIn();
  
  ampfft = new p5.FFT(0.95, numBands);
  ampfft.setInput(mic);
  ampW = width/numBands;
  
  wavefft = new p5.FFT(0.8, waveBands);
  wavefft.setInput(mic);
  
  planetSize = height/3;
  
  //initialize stars array
  for(var i = 0; i < numStars; i++){
  	var star = {
    	x:random(-width, width),
      y:random(-height, height),
      z:random(-planetSize - 200, planetSize/2),
      size:random(1, 5),
      alpha:random(30, 95)
  		};
  	stars.push(star);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
	userStartAudio();
  mic.start();
}
var spectrum, amp, sqamp;
var wavehue, wavesat, waveb, enchue;
var waveX, waveY, waveZ;
var rotateAngle = 0;
var rotateInc = 0.2;
var planetTexture, backImg;
//var planetSize;
var planetHue = 180;
var planetB = 60;
var planetScale = 1;
var starX, starY, starZ, starInterval, starSize, starScale;

function draw() {  
  orbitControl();
  background(0, 5, 5);
  //image(backImg, 0, 0, -200);

  ambientLight(0, 0, 60);
  directionalLight(0, 0, 100, 0, 0, -1);
   
  if(mic.getLevel() > 0){
  
    //amplitude
    spectrum = ampfft.analyze();
    wavehue = 270;
    wavesat, waveb = 90;
     
    //declare bass treble and mid
    bass = ampfft.getEnergy('bass');
    treble = ampfft.getEnergy('treble');
    mid = ampfft.getEnergy('mid');
    
    for(var i = spectrum.length; i > 0; i--){
			amp = spectrum[i];
      planetB = map(amp, 0, 255, 30, 90);
      /*sqamp = Math.sqrt(amp);
      shapeY = map(sqamp, 0, 16, height, 0);
      console.log(amp);
      rect(i*ampW, shapeY+40, ampW, height-shapeY);*/
    }
      
		//detup waveform around ring
    var wavespectrum = wavefft.waveform();
    strokeWeight(5);
    beginShape(QUAD_STRIP);

    var negtotal, postotal, negcount, poscount = 0;
    var xradius = planetSize * 1.5;
    var zradius = planetSize + 150;
		
    enchue = map(enc2, 0, 127, 0, 360);
   
    if(isNaN(wavehue)){
    	wavehue = 270;
    }
    
    for(var i = 0; i < waveBands; i++){     
      wavesat = 80;
      waveb = map(poscount, 800, 1200, 85, 95);
      //stroke(wavehue, wavesat, waveb);
      //fill(wavehue, wavesat, waveb);
      //var angle = map(i, 0, waveBands, 0, TWO_PI);

      waveX = cos(i) * xradius;
      waveY = map(wavespectrum[i], -1, 1, height, -height);
      waveZ = sin(i) * zradius;

      //wavehue = map(treble, 0, 255, 0, 15);
    //draw waveform ring
    push();
      noFill();
   		//console.log(`hue ${wavehue} sat ${wavesat} b ${waveb}`);
      wavehue = enchue + map(treble, 0, 255, 0, 30);
      stroke(wavehue, wavesat, waveb);
      vertex(waveX, waveY, waveZ);

      if(wavespectrum[i] < 0){
        negtotal += wavespectrum[i];
        negcount++;
      } else{
        postotal += wavespectrum[i];
        poscount++;
      }
    }
    endShape();
    pop();
    /* negtotal /= negcount;
    postotal /= poscount;
    console.log(`Neg: ${negtotal} -- Pos: ${postotal}`);
    console.log(`poscount = ${poscount}\n negcount = ${negcount}`);*/
  }
  
  //set encoder for stars
  numStars = map(enc4, 0, 127, 50, 1000);
  if(isNaN(numStars)){
  	numStars = stars.length;
  }
  console.log(numStars);
  var diff = stars.length - numStars;
  if(diff > 0){ //array is too long
  	for(var i = 0; i < diff; i++){
  		stars.pop();
    }
  }
  else if(diff < 0){ //array is too short
  	for(var i = 0; i < Math.abs(diff); i++){
      var star = {
        x:random(-width, width),
        y:random(-height, height),
        z:random(-planetSize - 200, planetSize/2),
        size:random(1, 3),
        alpha:random(30, 95)
        };
      stars.push(star);
      }
  }
  //render stars
  for(var i = 0; i < stars.length; i++){
  		push();
    	var starb = random(30, 95)
      starScale = map(treble, 0, 255, 1, 7);
      starSize = random(1, 3);
      
    	translate(stars[i].x, stars[i].y, stars[i].z);
      noStroke();
      ambientMaterial(0, 0, starb, starb);
      
      scale(starScale);
    	sphere(starSize);
      pop();
	}
  
  //set encoder parameters for planet
  rotateInc = map(enc3, 0, 127, 0, 4);
  if(isNaN(rotateInc)){
  	rotateInc = 0.2;
  }
  
  planetHue = map(enc1, 0, 127, 0, 360);
  if(isNaN(planetHue)){
  	planetHue = 180;
  }
  
  /*planetScale = map(enc4, 0, 127, 0.8, 1.2);
  if(isNaN(planetScale)){
  	planetScale = 1;
  }*/
  if(bass > bassThreshold){
  	planetScale = map(bass, bassThreshold, 255, 1, 1.3);
  }
  
  //create planet
  push();
  	noStroke();
  	ambientMaterial(planetHue, planetB, planetB);
  	texture(planetTexture);
  	scale(planetScale);
  	rotateX(rotateAngle);
  	rotateY(rotateAngle);
  	sphere(planetSize);
  	rotateAngle += rotateInc;
  pop();
  
  //draw notes
	/*if(noteOn && midivelocity > 0){
  	circleX = map(midimsg, 0, 88, -width+100, width-100);
    circleY = map(midimsg, 0, 88, -height+100, height-100);
    velocitysize = map(midivelocity, 1, 127, 20, 200);
  	fill(noteColor);
  	circle(circleX, noteY, velocitysize);
    fill('white');
    text(note, circleX, noteY);
  }*/  
}
