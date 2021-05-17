console.log('hello world');

//Initialize Sockets
let socket = io();
let performerSocket = io('/performer');

//Declare Globals
let userName;

let myImage;
function preload() {
    myImage = loadImage("Shanghai.jpeg");
  }

//Send Performer Settings to Audience on Initial Connection
function sendPresence() {
    console.log("sending connection to audience");
    let data = {
        "name" : userName,
        "synth" : true,
        "synthSetting" : "AMSynth({harmonicity: 1 / 2,detune: 0,oscillator: {type: 'sine'},envelope: {attack: 0.01,decay: 0.01,sustain: 1,release: 0.5},modulation: {type: 'square'},modulationEnvelope: {attack: 0.05,decay: 0,sustain: 1,release: 0.5}})",
        "controls" : [
            {
                "name" : "pitch"
            },
            {
                "name" : "volume",
                "startVal" : 3
            },
            {
                "name" : "duration",
                "startVal" : "4n"
            }
        ]
    };
    performerSocket.emit('sendPresence', data);
}

let scale;
let ready = false;
let mouseOnCanvas = false;

function draw() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        mouseOnCanvas = true;
    } else {
        mouseOnCanvas = false;
    }
}

function setup() {
    scale = Tonal.Scale.get("C4 major").notes;
    getUsername();
    sendPresence();
    createCanvas(600,400);
    image(myImage, 0, 0);

    ready = true;
}

function mousePressed() {
    if (ready && mouseOnCanvas) { 
        let R = myImage.get(mouseX, mouseY);
        console.log(R);
        let noteNumber = R[0] % 16;
        let note = mapNote(noteNumber, scale);
        note = "'" + note + "'";
        console.log(note);
        let value = {
            "pitch" : note
        }
        sendData(value);
    }
}

//Generates Username from URL
function getUsername() {
    let splitURL = window.location.href.split('performer/');
    let rawName = splitURL[1].split('/');
    userName = rawName[0];
    console.log(userName);
    document.getElementById('title').innerHTML = "Welcome " + userName;
}

let durations = ["32n", "16n", "8n", "4n", "2n", "1n"]

window.addEventListener('load', () => {
    document.getElementById('title').innerHTML = "Welcome " + userName;

    //Volume Slider Event Listener
    document.getElementById('slider1').addEventListener('mouseup', () => {
        console.log('slider adjusted');
        let inputValue = document.getElementById('slider1').value;
        Number(inputValue).toPrecision(2);
        let value = {
            "volume" : inputValue
        }
        // console.log(value);
        sendData(value);
    });
    document.getElementById('slider2').addEventListener('mouseup', () => {
        console.log('slider adjusted');
        let input = document.getElementById('slider2').value;
        let inputValue = "'" + durations[input] + "'";
        let value = {
            "duration" : inputValue
        }
        // console.log(value);
        sendData(value);
    });
});

function mapNote(noteNumber, scale) {
    let numNotes = scale.length;
    let i = modulo(noteNumber, numNotes);
    let note = scale[i];
    let octaveTranspose = floor(noteNumber / numNotes);
    let interval = Tonal.Interval.fromSemitones(octaveTranspose * 12);
    return Tonal.Note.transpose(note, interval);
}

function modulo(n, m) {
    return ((n % m) + m) % m;
}

//Send Data From DOM Event Listeners
function sendData(value) {
    let data = {
        "name" : userName,
        "value" : value
    }
    console.log(data);
    performerSocket.emit('sendData', data);
}