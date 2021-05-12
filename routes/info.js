let express = require('express');
let router = express.Router();

router.use((req, res, next) => {
    console.log(req.url + "@" + Date.now());
    next();
});

router
    .use('/about', express.static('./pages/info/about'));
    // .route('/about')
    //     .get((req, res) => {
    //         res.sendFile('/info/about/index.html', { root: './pages'});
    //         res.sendFile('/info/about/app.js', { root: './pages'});  
    //     });

router
    .use('/bios', express.static('./pages/info/bios'));

router
    .use('/video', express.static('./pages/info/video'));

module.exports = router;