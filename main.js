var noteOn = false;
var noteNum = 1;
var note = "";
var noteY = 0;
var noteColor = "white";
var velocity = 0;
const numKeys = 76;
var keyboard;
const s1name = "S-1"; 
const keyboardName = "CASIO USB-MIDI";
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
          document.body.innerHTML = `${input.name} discovered!`;
          if (input.name == keyboardName || input.name == s1name){
            keyboard = input;
          } else{
            console.log(keyboardName + " not found!");
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
  if(msg.data[0] == 144){
  	noteOn = true;
  } else noteOn = false;
  noteNum = msg.data[1] - 15;
  setNote(noteNum);
  
  velocity = msg.data[2];
  if(noteOn){
 		console.log("Note " + note + " " + noteNum + " on at " + velocity + " velocity\n");
    //document.body.innerHTML= `Note ${note} ${noteNum} on at ${velocity} velocity`;
  } else if(!Number.isNaN(noteNum)){
  	console.log("Note " + note + " " + noteNum + " off\n");
  }
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
      noteColor = 'gold';
      break;
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
var mic, fft, shapeW;
var numBands = 64;

function setup() {
  createCanvas(canvasX, canvasY);
  colorMode(HSB);
  angleMode(DEGREES);
  
  loadFont('https://cdn.prod.website-files.com/63e530686f211b120ea271c6/67b67656f61615fb9e300337_Ubuntu-Medium.ttf', font => {
    fill('white');
    textFont(font, 16);
  });
  
  strokeWeight(2);
  noFill();
  stroke('black');
  background('black');
  
  getAudioContext().suspend();
  mic = new p5.AudioIn();
  fft = new p5.FFT(0.9, numBands);
  fft.setInput(mic);
  shapeW = width/numBands;
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
  background('black');
  if(mic.getLevel() > 0){
  	var count = 0;
    var spectrum = fft.analyze();
    for(var i = spectrum.length; i > 0; i--){
			var amp = spectrum[i];
      if(amp == 0)
      {
      	continue;
      }
      count++;
			var sqamp = Math.sqrt(amp);
      var shapeY = map(sqamp, 0, 16, height, 0);
      noStroke();
      fill(amp, 128, 128);
      rect(count*shapeW, shapeY+40, shapeW, height-shapeY);
    }
    console.log(spectrum);
  }
  if(noteOn){
  	circleX = map(noteNum, 0, 88, 150, width-150);
    circleY = map(noteNum, 0, 88, 150, height-150);
    velocitysize = map(velocity, 1, 127, 20, 200);
  	fill(noteColor);
  	circle(circleX, noteY, velocitysize);
    fill('white');
    text(note, circleX, noteY);
  }  
}
