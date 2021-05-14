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
app.use('/', express.static('./pages/root'));

let io = require('socket.io')(server);

let audienceSocket = io.of('/audience');
audienceSocket.on('connection', (socket) => {
    console.log('new audience @ ' + socket.id);
});

let performerSocket = io.of('/performer');
performerSocket.on('connection', (socket) => {
    console.log('new performer @ ' + socket.id);
    socket.on('sendData', (data) => {
        console.log(data);
        data.socketID = socket.id;
        audienceSocket.emit('getData', data);
    });
    socket.on('disconnect', () => {
        audienceSocket.emit("performerDisconnect", socket.id);
    });
});

io.sockets.on('connection', (socket) => {
    console.log("new socket connection @ " + socket.id);
});

server.listen(PORT, () => {
    console.log('App listening at http://localhost:3000');
});
