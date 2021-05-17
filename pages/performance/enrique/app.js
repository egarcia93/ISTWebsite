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
        "synthSetting" : "Sampler({urls: {A1: 'A1.wav'},baseUrl: 'https://ist-webpage.herokuapp.com/performance/audience/',onload: () => {console.log('loaded');}})",
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
            },
            {
                "name" : "delay",
                "startVal" : "8n"
            },
            {
                "name" : "feedback",
                "startVal" : 0.5
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
    WebMidi.enable(function (err) { 
        if (err) {
          console.log("WebMidi could not be enabled.", err);
        } else {
          console.log("WebMidi enabled!");
          for(i = 0; i< WebMidi.inputs.length; i++){
            console.log(i + ": " + WebMidi.inputs[i].name);
         }
         console.log("---");
         console.log("Output Ports: ");
         for(i = 0; i< WebMidi.outputs.length; i++) {
           console.log(i + ": " + WebMidi.outputs[i].name); 	
         }  
         inputSoftware = WebMidi.inputs[0];
         inputSoftware.addListener('noteon', "all", function(e) {
           console.log(e.note);
           let note = "'" + e.note.name+e.note.octave + "'";
           let value = {
               "pitch" : note
           }
           sendData(value);
            });
        }
        console.log("---");
        console.log("Inputs Ports: ");
    });

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
    document.getElementById('slider3').addEventListener('mouseup', () => {
        console.log('slider adjusted');
        let input = document.getElementById('slider3').value;
        let inputValue = "'" + durations[input] + "'";
        let value = {
            "duration" : inputValue
        }
        // console.log(value);
        sendData(value);
    });
    document.getElementById('slider4').addEventListener('mouseup', () => {
        console.log('slider adjusted');
        let inputValue = document.getElementById('slider4').value;
        let value = {
            "duration" : inputValue
        }
        // console.log(value);
        sendData(value);
    });
});

//Send Data From DOM Event Listeners
function sendData(value) {
    let data = {
        "name" : userName,
        "value" : value
    }
    console.log(data);
    performerSocket.emit('sendData', data);
}