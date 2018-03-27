const router = require('express').Router();
const ctrl = require('./ctrls');

router.get('/', ctrl.list);
router.get('/:_id', ctrl.read);
router.post('/', ctrl.add);
router.put('/', ctrl.mod);
router.delete('/', ctrl.del);

router.post('/comment', ctrl.addCmt);
router.put('/comment', ctrl.modCmt);
router.delete('/comment', ctrl.delCmt);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;
