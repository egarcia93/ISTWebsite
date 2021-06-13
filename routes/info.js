let express = require('express');
let router = express.Router();

router.use((req, res, next) => {
    console.log(req.url + "@" + Date.now());
    next();
});

// router
//     .use('/about', express.static('./pages/info/about'));
//     // .route('/about')
//     //     .get((req, res) => {
//     //         res.sendFile('/info/about/index.html', { root: './pages'});
//     //         res.sendFile('/info/about/app.js', { root: './pages'});  
//     //     });

router
    .use('/assets', express.static('./pages/info/assets'))

router
    .use('/about', express.static('./pages/info/about'));

router 
    .use('/artists', express.static('./pages/info/artists'));

router
    .use('/performances', express.static('./pages/info/performances'));

router
    .use('/home', express.static('./pages/info/home'));

module.exports = router;