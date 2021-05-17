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
        "synthSetting" : "MetalSynth({frequency: 250,envelope: {attack: 0.01,decay: 1.4,release: 0.2,},harmonicity: 5.1,modulationIndex: 32,octaves: 1.5,resonance: 8000,})",
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