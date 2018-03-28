const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
  // console.log(req.headers.authorization);
  // console.log(req.path);
  if (req.path === '/auth/sign/in') return next();
  if (req.path === '/auth/register') return next();
  if (!req.headers.authorization) return res.status(401).send({ success: false, msg: 'authorization empty' });

  const token = req.headers.authorization;

  jwt.verify(token, req.app.get('jwt-secret'), (err, d) => {
    if (err) return res.status(401).send({ success: false, msg: 'your token expired' });
    // console.log(new Date(d.exp*1000).toLocaleString());
    req.token = d;
    // console.log(req.token);
    next();
  });
};