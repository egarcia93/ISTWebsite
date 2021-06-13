let express = require('express');
let app = express();
//Environment variables
let dotenv = require('dotenv');
//Database conn
let mongoose = require('mongoose');

dotenv.config();

//Connect to db
mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser: true},
    ()=> console.log('connected to db')
    );

let http = require('http');
let server = http.createServer(app);

let PORT = process.env.PORT || 3000;
let info = require('./routes/info');
let performance = require('./routes/performance');
app.use(express.json());
app.use('/info', info);
app.use('/performance', performance);
app.use('/', express.static('./pages/info/home'));
let io = require('socket.io')(server);


// app.get('/pages/performance/audience/:soundFile', (req, res) => {
//     let fileName = req.params.soundFile;
//     console.log(fileName);
//     res.sendFile('/'+ fileName, (err) => {
//         if (err) {
//             console.log("error sending " + fileName);
//         } else {
//             console.log('successfully sent ' + fileName);
//         }
//     });
// });

//ARRAY OF ACTIVE PERFORMERS
let activePerformers = [];

//AUDIENCE SOCKET
let audienceSocket = io.of('/audience');
audienceSocket.on('connection', (socket) => {
    console.log('new audience @ ' + socket.id);
    socket.emit('activePerformers', activePerformers);
});

//PERFORMER SOCKET
let performerSocket = io.of('/performer');
performerSocket.on('connection', (socket) => {
    // console.log('new performer @ ' + socket.id);
    
    //Route Performer Connection to Audience
    socket.on('sendPresence', (data) => {
        activePerformers.push(data);
        console.log(activePerformers);
        // console.log(data);
        data.socketID = socket.id;
        audienceSocket.emit('getPresence', data);
    });

    //Route Performer Data to Audience
    socket.on('sendData', (data) => {
        data.socketID = socket.id;
        console.log(data);
        audienceSocket.emit('getData', data);
    });

    //Route Performer Disconnect to Audience
    socket.on('disconnect', () => {
        for (i = 0; i < activePerformers.length; i++) {
            if (activePerformers[i].socketID === socket.id) {
                activePerformers.splice(i, 1);
            }
        }
        console.log(activePerformers)
        audienceSocket.emit("performerDisconnect", socket.id);
    });
});

io.sockets.on('connection', (socket) => {
    console.log("new socket connection @ " + socket.id);
});

server.listen(PORT, () => {
    console.log('App listening at http://localhost:3000');
});
