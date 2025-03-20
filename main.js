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
var numBands = 32;
var waveBands = 2048;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);
  angleMode(DEGREES);
  smooth();
  
  loadFont('https://cdn.prod.website-files.com/63e530686f211b120ea271c6/67b67656f61615fb9e300337_Ubuntu-Medium.ttf', font => {
    fill('white');
    textFont(font, 32);
  });
  text('tap on screen', windowWidth/2, windowHeight/2);
  
  strokeWeight(2);
  noFill();
  stroke('black');
  noteColor = 'gold';
  background('black');
  
  getAudioContext().suspend();
  mic = new p5.AudioIn();
  
  ampfft = new p5.FFT(0.95, numBands);
  ampfft.setInput(mic);
  ampW = width/numBands;
  
  wavefft = new p5.FFT(0.8, waveBands);
  wavefft.setInput(mic);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
	userStartAudio();
  mic.start();
}

function draw() { 
	//mic test
  /*var vol = mic.getLevel();
  console.log(vol);
  fill('white');
  circle(width/4, height/2, vol*10000);
  */
  
  /*if(frameCount % 1000 == 0){
  	background('black');
  }*/
  // Enable orbiting with the mouse.
  orbitControl();

  // Turn on the lights.
  ambientLight(255);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  background(0, 5, 5);
  if(mic.getLevel() > 0){
  
    //amplitude
    var spectrum = ampfft.analyze();
    var amp, sqamp, shapeY;
    var wavehue, wavesat, waveb;
    var enchue;
    
    for(var i = spectrum.length; i > 0; i--){
			amp = spectrum[i];
      wavehue = map(amp, 0, 255, 0, 360);
      
      enchue = wavehue + enc1;
      if(enchue <= 360){
      	wavehue = enchue;
      } else{
      	wavehue = enchue - 360;
      }
      
      //sqamp = Math.sqrt(amp);
      //shapeY = map(sqamp, 0, 16, height, 0);
      //console.log(amp);
      //rect(i*ampW, shapeY+40, ampW, height-shapeY);
    }
    
    //waveform
    var wavespectrum = wavefft.waveform();
    strokeWeight(9);
    //stroke('hotpink');
    noFill();
    beginShape(QUAD_STRIP);
    
    var negtotal = 0;
    var postotal = 0;
    var negcount = 0;
    var poscount = 0;
    
    for(var i = 0; i < wavespectrum.length; i++){     
      wavesat = map(negcount, 800, 1200, 85, 100);
      waveb = map(poscount, 800, 1200, 85, 100);
    	//stroke(wavehue, wavesat, waveb);
      //fill(wavehue, wavesat, waveb);
      
			var waveX = map(i, 0, wavespectrum.length, -width*1.5, width*1.5);
      var waveY = map(wavespectrum[i], -1, 1, height*6, -height*6);
     	var waveZ = map(amp, 60, 150, -200, 200); 
      
      if(frameCount % 2 == 0){
      	wavehue = map(waveY, height, -height, 0, 360);
        enchue = wavehue + enc2;
        if(enchue <= 360){
          wavehue = enchue;
        } else{
          wavehue = enchue - 360;
        }
      }
      //wavehue = map(negcount, 800, 1200, 20, 340);
      stroke(wavehue, wavesat, waveb);
      let endPoint = createVector(0, 20);
    	endPoint.rotate((endPoint.z + frameCount) * 0.1);
      vertex(waveX, waveY, endPoint.z);
      
      if(wavespectrum[i] < 0){
      	negtotal += wavespectrum[i];
        negcount++;
      } else{
        	postotal += wavespectrum[i];
          poscount++;
      }
    }
    endShape();
    /*if(frameCount % 100 == 0){
        var backhue = map(negcount, 800, 1200, 0, 360);
        var backb = map(negcount, 800, 1200, 0, 25);
        background(backhue, backb, backb);
    }*/
    
    negtotal /= negcount;
    postotal /= poscount;
    //console.log(`Neg: ${negtotal} -- Pos: ${postotal}`);
    //console.log(`poscount = ${poscount}\n negcount = ${negcount}`);
  }
  if(noteOn){
  	circleX = map(midimsg, 0, 88, 150, width-150);
    circleY = map(midimsg, 0, 88, 150, height-150);
    velocitysize = map(midivelocity, 1, 127, 20, 200);
  	fill(noteColor);
  	circle(circleX, noteY, velocitysize);
    fill('white');
    text(note, circleX, noteY);
  }  
}
