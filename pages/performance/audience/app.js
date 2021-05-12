let audienceSocket = io('/audience');
console.log('hello world');
let activePerformers = [];

audienceSocket.on('getData', (data) => {
    console.log(data);
    for (i = 0; i < activePerformers.length; i++) {
        if (activePerformers[i] === data.socketID) {
            document.getElementById(data.socketID).innerHTML = data.name + ": " + data.value;
        }
    };
    let index = activePerformers.indexOf(data.socketID);
    if (index < 0) {
        activePerformers.push(data.socketID);
        let element = document.createElement('h5');
        element.innerHTML = data.name + ": " + data.value;
        element.id = data.socketID;
        document.getElementById('performerFeeds').appendChild(element);
    }
    console.log(index);
});

audienceSocket.on('performerDisconnect', (data) => {
    console.log(data);
    for (i = 0; i < activePerformers.length; i++) {
        if (activePerformers[i] === data) {
            let index = activePerformers.indexOf(data);
            activePerformers.splice(index, 1);
            document.getElementById(data).remove();
        }
    }
});