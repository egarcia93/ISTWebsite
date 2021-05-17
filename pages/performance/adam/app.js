console.log('hello world');

//Initialize Sockets
let socket = io();
let performerSocket = io('/performer');

//Declare Globals
let userName;

//Send Performer Settings to Audience on Initial Connection
function sendPresence() {
    let splitURL = window.location.href.split('performer/');
    let processedURL = "'" + splitURL[0] + "assets/C4.wav'";
    console.log(processedURL);
    console.log("sending connection to audience");
    let data = {
        "name" : userName,
        "synth" : processedURL,
        "synthSetting" : "Sampler(this.buffer)",
        "controls" : [
            {
                "name" : "pitch"
            },
            {
                "name" : "envelope",
                "attack" : 0.1,
                "decay" : 0,
                "sustain" : 1,
                "release" : 0.2
            },
            {
                "name" : "volume",
                "startVal" : 3
            },
            {
                "name" : "distortion",
                "startVal" : 0.8
            }
        ]
    };
    console.log(data);
    performerSocket.emit('sendPresence', data);
}

let scale;
let ready = false;

function setup() {
    scale = Tonal.Scale.get("C4 major").notes;
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

    //Pitch Slider Event Listener
    document.getElementById('slider2').addEventListener('mouseup', () => {
        console.log('slider adjusted');
        let inputValue = document.getElementById('slider2').value;
        let value = {
            "distortion" : inputValue
        }
        // console.log(value);
        sendData(value);
    });
});

function keyPressed() {
    if (ready) {
      // let noteNumber = floor(map(mouseX, 0, width, -7, 7));
        noteNumber = 0;
        let note = [];
  
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
      let note1 = mapNote(noteNumber, scale);
      let note2 = mapNote(noteNumber + 4, scale);
      let note3 = mapNote(noteNumber + 8, scale);
      note = '"[' + note1 + ', ' + note2 + ', ' + note3 + ']"'
    //   note = [
    //     mapNote(noteNumber, scale),
    //     mapNote(noteNumber + 4, scale),
    //     mapNote(noteNumber + 8, scale),
    //   ];
    //   note = `'"` + note + `"'`;
    //   let processedNotes = [];
    //   for (i = 0; i < note.length; i++) {
    //       let processedNote = "'" + note[i] + "'";
    //       console.log(processedNote);
    //       processedNotes.push(processedNote);
    //   }
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