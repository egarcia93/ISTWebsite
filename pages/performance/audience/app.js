//Initializations
let audienceSocket = io('/audience');
let activePerformers = [];

//Get a list of active performers on initial connection
audienceSocket.on('activePerformers', (data) => {
    for (i = 0; i < data.length; i++) {
        let newPerformer = new Performer(data[i]);
        ready = false;
        newPerformer.setupInstrument();
        activePerformers.push(newPerformer);
    }
    // console.log(activePerformers);
});

//Get new performer connection
audienceSocket.on('getPresence', (data) => {
    let newPerformer = new Performer(data);
    ready = false;
    newPerformer.setupInstrument();
    activePerformers.push(newPerformer);
    // console.log(activePerformers);
});

//Get data from active performers
audienceSocket.on('getData', (data) => {
    // console.log(data);
    for (j = 0; j < activePerformers.length; j++) {
        if (activePerformers[j].id === data.socketID) {
            // document.getElementById(data.socketID).innerHTML = data.name + ": " + data.value;
            // console.log(j);
            activePerformers[j].checkData(data.value);
        }
    };
});

//Get performer disconnect
audienceSocket.on('performerDisconnect', (data) => {
    // console.log(data);
    for (i = 0; i < activePerformers.length; i++) {
        if (activePerformers[i].id === data) {
            activePerformers.splice(i, 1);
            // console.log(data + "disconnected");
        }
    }
});