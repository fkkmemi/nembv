const router = require('express').Router()

const test = require('./test')

router.all('*', (req, res, next) => {
  console.log(req.path + ' welcome to api');
  // 미들웨어가 들어갈 곳
  next();
})

router.use('/test', test);

router.all('*', (req, res) => {
  res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});
module.exports = router;