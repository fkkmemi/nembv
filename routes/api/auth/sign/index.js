const router = require('express').Router();
const ctrl = require('./ctrls');

router.post('/in', ctrl.in);
router.post('/out', ctrl.out);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;
