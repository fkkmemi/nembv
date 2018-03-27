const router = require('express').Router();
const talk = require('./talk');
const qna = require('./qna');

router.use('/talk', talk);
router.use('/qna', qna);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;
