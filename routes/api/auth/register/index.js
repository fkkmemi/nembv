const router = require('express').Router();
const ctrl = require('./ctrls');

router.post('/', ctrl.add);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;
