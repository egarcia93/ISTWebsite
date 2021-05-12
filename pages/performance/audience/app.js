let audienceSocket = io('/audience');
console.log('hello world');
let activePerformers = [];

audienceSocket.on('getData', (data) => {
    // console.log(data);
    for (i = 0; i < activePerformers.length; i++) {
        if (activePerformers[i] === data.socketID) {
            document.getElementById(data.socketID).innerHTML = data.name + ": " + data.value;
            checkData(data.value);
        }
    };
    let index = activePerformers.indexOf(data.socketID);
    if (index < 0) {
        activePerformers.push(data.socketID);
        let element = document.createElement('h5');
        element.innerHTML = data.name + ": " + data.value;
        element.id = data.socketID;
        document.getElementById('performerFeeds').appendChild(element);
        checkData(data.value);
    }
    // console.log(index);
});

let instrument1Pitch = "C4";
let instrument1Pitches = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
function checkData(data) {
    console.log(data);
    if (data.hasOwnProperty('start')) {
        if (data.start === true) {
            console.log("start signal registered");
            if (timestampsLoaded) {
                Tone.start();
                soundPlaying = true;
            }
        }
        if (data.start === false) {
            console.log("stop signal registered");
            // Tone.stop();
            soundPlaying = false;
        }
    }
    if (data.hasOwnProperty('volume')) {
        synth.volume.value = data.volume;
        console.log("Volume: " + data.volume);
    }
    if (data.hasOwnProperty('pitch')) {
        instrument1Pitch = instrument1Pitches[data.pitch];
        console.log("Pitch: " + instrument1Pitch);
    }
    if (data.hasOwnProperty('rate')) {
        limiter = data.rate;
        console.log("Limiter: " + limiter);
    }
}

audienceSocket.on('performerDisconnect', (data) => {
    // console.log(data);
    for (i = 0; i < activePerformers.length; i++) {
        if (activePerformers[i] === data) {
            let index = activePerformers.indexOf(data);
            activePerformers.splice(index, 1);
            document.getElementById(data).remove();
        }
    }
});

let editedTimestamps = [];
let timestampsLoaded = false;
let soundPlaying = false;
window.addEventListener('load', () => {
    fetch("http://earthquake.usgs.gov/fdsnws/event/1/query.geojson")
    .then(response => response.json())
    .then(data => {
        let timestamps = [];
        for (i = 0; i < 1000; i++) {
            let timestamp = data.features[i].properties.time;
            timestamps.push(timestamp);
        }
        // console.log(timestamps);
        for (i = 999; i > -1; i--) {
            let timestampString = timestamps[i].toString();
            let timestamp = parseInt(timestampString.substring(0, 9));
            editedTimestamps.push(timestamp);
            // console.log(timestamp);
        }
        // console.log(editedTimestamps);
        timestampsLoaded = true;
    });
});

const synth = new Tone.MembraneSynth().toDestination();

let counter = 0;
let currentTimestamp = 0;
let limiter = 120;
function draw() {
    if (soundPlaying) {
        if (counter % ((editedTimestamps[currentTimestamp + 1] - editedTimestamps[currentTimestamp]) + limiter) === 0) {
            console.log(currentTimestamp);
            synth.triggerAttackRelease(instrument1Pitch, "8n");
            currentTimestamp++;
        }
        counter++;
    }
}