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
let port = process.env.port || 3000;
let info = require('./routes/info');
let performance = require('./routes/performance');
app.use(express.json());
app.use('/info', info);
app.use('/performance', performance);
app.use('/', express.static('./pages/root'));

app.listen(port, () => {
    console.log('App listening at http://localhost:3000');
});
