console.log('hello world');

//Initialize Sockets
let socket = io();
let performerSocket = io('/performer');

//Declare Globals
let userName;

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

let ready = false;
let scale;

function setup() {
    scale = Tonal.Scale.get("Ab2 major").notes;
    getUsername();
    sendPresence();
    ready = true;
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

function keyPressed() {
    if (ready) {
        noteNumber = 0;
        switch (key) {
            case "s":
            noteNumber = 0;
            break;
            case "q":
            noteNumber = 1;
            break;
            case "w":
            noteNumber = 2;
            break;
            case "e":
            noteNumber = 3;
            break;
            case "a":
            noteNumber = 4;
            break;
            case "d":
            noteNumber = 5;
            break;
            case "z":
            noteNumber = 6;
            break;
            case "x":
            noteNumber = 7;
            break;
            case "c":
            noteNumber = 8;
            break;
      }
      let note = mapNote(noteNumber, scale);
      note = '"' + note + '"';
      let value = {
        "pitch" : note
        }
        sendData(value);
    }
}

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