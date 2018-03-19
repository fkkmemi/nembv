const router = require('express').Router();
const ctrl = require('./ctrls');

router.get('/list', ctrl.list);
// router.post('/add', ctrl.add);
// router.put('/mod', ctrl.mod);
// router.delete('/del', ctrl.del);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;
