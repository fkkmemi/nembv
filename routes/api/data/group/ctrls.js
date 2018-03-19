const Company = require('../../../../models/companies');

exports.list = (req, res) => {
  Company.find()
    .then((cp) => {
      res.send({ success: true, d: cp });
    })
    .catch(err => res.send({ status: false, msg: err.message }));
};
