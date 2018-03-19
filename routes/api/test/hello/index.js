const router = require('express').Router();
const ctrl = require('./ctrls');

router.get('/plz', ctrl.plz);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;
