const router = require('express').Router();
const company = require('./company');
const group = require('./group');
const board = require('./board');
const comment = require('./comment');

router.use('/company', company);
router.use('/group', group);
router.use('/board', board);
router.use('/comment', comment);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;