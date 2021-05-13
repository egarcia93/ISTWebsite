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
    .use('/register', express.static('./pages/performance/register'));

router
    .use('/performer/:userid', express.static('./pages/performance/performer-userid'));

router
    .use('/audience', express.static('./pages/performance/audience'));

router
    .use('/audience/:userid', express.static('./pages/performance/audience-userid'));

router.post('/register',async (req,res)=>{
    //Validate data
        const{error} = registerValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);
    //Check for repeated users
    
        const emailExist = await User.findOne({email: req.body.email});
    
        if(emailExist) return res.status(400).send('Email already exists');
    
    //Hashing password
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
    
    
    //Create new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        try{
            const savedUser = await user.save();
            res.json({task:"success"});
        }catch(err){
            res.status(400).send(err);
        }
    
    
    });
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