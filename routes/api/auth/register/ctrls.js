const User = require('../../../../models/users');

exports.add = (req, res) => {
  const { id, email, pwd } = req.body;

  if (id === undefined) return res.send({ success: false, msg: 'param err id' });
  if (email === undefined) return res.send({ success: false, msg: 'param err email' });
  if (pwd === undefined) return res.send({ success: false, msg: 'param err pwd' });

  const u = new User({
    id: id,
    email: email,
    pwd: pwd,
  });

  u.save()
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
};
