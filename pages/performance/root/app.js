console.log('hello world');

let audienceSocket = io('/audience');
let activePerformers = [];

audienceSocket.on('activePerformers', (data) => {
    for (i = 0; i < data.length; i++) {
        activePerformers.push(data);
    }
    console.log(activePerformers);
});

audienceSocket.on('getPresence', (data) => {
    activePerformers.push(data);
    console.log(activePerformers);
});

audienceSocket.on('performerDisconnect', (data) => {
    // console.log(data);
    for (i = 0; i < activePerformers.length; i++) {
        if (activePerformers[i].id === data) {
            activePerformers.splice(i, 1);
            // console.log(data + "disconnected");
        }
    }
});

window.addEventListener('load', () => {
    document.getElementById('audienceNav').addEventListener('click', () => {
        if (activePerformers.length < 1) {
            document.getElementById('audienceNav').innerHTML = "No live performances";
            setTimeout(() => {
                document.getElementById('audienceNav').innerHTML = "AN AUDIENCE MEMBER";
            }, 3000);
        } else {
            document.getElementById('audienceNav').href = '/performance/audience';
            window.location.href = document.getElementById('audienceNav').href
        }
    })
})

// window.addEventListener('load', () => {
//     document.getElementById('button1').addEventListener('click', () => {
//         console.log('button 1 clicked');
//         // window.location.replace(window.location.href + "performance");
//         window.location.href = window.location.href + "login";
//     });
//     document.getElementById('button2').addEventListener('click', () => {
//         console.log('button 2 clicked');
//         // window.location.replace(window.location.href + "info/about");
//         window.location.href = window.location.href + "audience";
//     });
// });