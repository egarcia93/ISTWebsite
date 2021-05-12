console.log('hello world');

let socket = io();

let splitURL = window.location.href.split('performer/');
// console.log(splitURL[1]);
let rawName = splitURL[1].split('/');
let userName = rawName[0];
// console.log(userName);

let performerSocket = io('/performer');

let startPressed = false;

window.addEventListener('load', () => {
    document.getElementById('title').innerHTML = "Welcome " + userName;
    document.getElementById('startButton').addEventListener('click', () => {
        console.log('start button pressed');
        document.getElementById('startButton').disabled = true;
        document.getElementById('stopButton').disabled = false;
        let value = {
            "start" : true
        };
        sendData(value);
    });
    document.getElementById('stopButton').addEventListener('click', () => {
        console.log('stop button pressed');
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
        let value = {
            "start" : false
        };
        sendData(value);
    });
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
        let inputValue = document.getElementById('slider2').value;
        let value = {
            "pitch" : inputValue
        }
        // console.log(value);
        sendData(value);
    });
    document.getElementById('slider3').addEventListener('mouseup', () => {
        console.log('slider adjusted');
        let inputValue = Math.floor(document.getElementById('slider3').value);
        let value = {
            "rate" : inputValue
        }
        // console.log(value);
        sendData(value);
    });
});

function sendData(value) {
    let data = {
        "name" : userName,
        "value" : value
    }
    performerSocket.emit('sendData', data);
}