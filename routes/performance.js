let express = require('express');
let router = express.Router();

let User = require('../model/User');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');

router.use((req, res, next) => {
    console.log(req.url + "@" + Date.now());
    next();
});

router
    .use('/', express.static('./pages/performance/root'));
    // .route('/')
    // .get((req, res) => {
    //     res.send('PERFORMANCE LANDING PAGE');
    // });

router
    .use('/login', express.static('./pages/performance/login'));

router
    .use('/performer/michael', express.static('./pages/performance/michael'));

router
    .use('/performer/adam', express.static('./pages/performance/adam'));
    
router
    .use('/performer/po-wen', express.static('./pages/performance/po-wen'));

router
    .use('/performer/yiru', express.static('./pages/performance/yiru'));

router
    .use('/performer/enrique', express.static('./pages/performance/enrique'));

router
    .use('/audience', express.static('./pages/performance/audience'));

// router
//     .use('/audience/C4.wav', express.static('C4.wav'));

// router
//     .use('/audience/C4.wav', express.static('./pages/performance/audience/C4.wav'))

// router
//     .use('/audience/:userid', express.static('./pages/performance/audience-userid'));


//Login
router.post('/login',async(req,res)=>{
    
        const{error} = loginValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        const user = await User.findOne({name: req.body.name});
    
        if(!user) return res.status(400).send('Email is not found');
        //Password
        const validPass = await bcrypt.compare(req.body.password,user.password);
    
        if(!validPass) return res.status(400).send('Invalid password');
        //Create token
        //const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET);
        //res.header('auth-token',token).send(token);
        res.json({task:"success"});
    });

module.exports = router;