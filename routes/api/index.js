const router = require('express').Router();

const check = require('./check');
const auth = require('./auth');
const data = require('./data');
const test = require('./test');

router.all('*', check.verify);
router.use('/auth', auth);
router.use('/data', data);
router.use('/test', test);

router.all('*', (req, res) => {
  res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;