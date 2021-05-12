console.log('hello world');

let socket = io();

let splitURL = window.location.href.split('performer/');
console.log(splitURL[1]);
let rawName = splitURL[1].split('/');
let userName = rawName[0];
console.log(userName);

let performerSocket = io('/performer');

window.addEventListener('load', () => {
    document.getElementById('title').innerHTML = "Welcome " + userName;
    document.getElementById('button1').addEventListener('click', () => {
        console.log('button1 pressed');
        let inputValue = document.getElementById('input').value;
        let data = {
            "name" : userName,
            "value" : inputValue
        }
        performerSocket.emit('sendData', data);
        document.getElementById('input').value = '';
    });
});