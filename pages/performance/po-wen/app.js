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
        "synthSetting" : "FMSynth({harmonicity: 1.025,modulationIndex: 10,detune: 0,oscillator: {type: 'sine'},envelope: {attack: 0.1,decay: 0.0001,sustain: 1,release: 0.5},modulation: {type: 'square'},modulationEnvelope: {attack: 0.001,decay: 0,sustain: 1,release: 0.5}})",
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

function setup() {
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
        let note;
      // let noteNumber = floor(map(mouseX, 0, width, -7, 7));
      //Q Pressed
      if (keyCode === 81) {
        note = "'C2'";
      }
      //W Pressed
      if (keyCode === 87) {
        note = "'Ab1'";
      }
      let value = {
        "pitch" : note
        }
        sendData(value);
    }
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