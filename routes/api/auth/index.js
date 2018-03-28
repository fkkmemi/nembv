const router = require('express').Router()
const sign = require('./sign');
const register = require('./register');

router.use('/sign', sign);
router.use('/register', register);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;