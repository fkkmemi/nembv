const Company = require('../../../../models/companies');
const Group = require('../../../../models/groups');

exports.list = (req, res) => {
  // res.send({ success: false, msg: 'list 준비중입니다' });
  // Company.find()
  //   .then(rs => res.send({ success: true, ds: rs }))
  //   .catch(err => res.send({ success: false, msg: err.message }));
  let { draw, search, skip, limit, order, sort } = req.query;

  if(draw === undefined) return res.send({ success: false, msg: 'param err draw' });
  if(search === undefined) return res.send({ success: false, msg: 'param err search' });
  if(skip === undefined) return res.send({ success: false, msg: 'param err skip' });
  if(limit === undefined) return res.send({ success: false, msg: 'param err limit' });
  if(order === undefined) return res.send({ success: false, msg: 'param err order' });
  if(sort === undefined) return res.send({ success: false, msg: 'param err sort' });

  skip = parseInt(skip);
  limit = parseInt(limit);
  sort = parseInt(sort);

  let d = {
    draw: draw,
    cnt: 0,
    ds: [],
  };

  Company.count()
    .where('name').regex(search)
    .then((c) => {
      d.cnt = c;
      const s = {}
      s[order] = sort;
      return Company.find()
        .where('name').regex(search)
        .populate('gr_ids')
        .sort(s)
        .skip(skip)
        .limit(limit);
    })
    .then((ds) => {
      d.ds = ds;
      res.send({success: true, d: d});
    })
    .catch((err) => {
      res.send({success: false, msg : err.message});
    });
};

exports.add = (req, res) => {
  // res.send({ success: false, msg: 'add 준비중입니다' });
  // const { name, rmk } = req.body;
  //
  // if (!name) return res.send({ success: false, msg: '이름 없음' });
  // if (!rmk) return res.send({ success: false, msg: '비고 없음' });
  // const cp = new Company({ name: name, rmk: rmk });
  // cp.save()
  //   .then(r => res.send({ success: true, d: r }))
  //   .catch(err => res.send({ success: false, msg: err.message }));

  const { name } = req.body;
  if(!name) res.send({success: false, msg : 'name not exists'});
  const cp = new Company({ name: name });
  cp.save()
    .then(() => {
      res.send({success: true});
    })
    .catch((err) => {
      res.send({success: false, msg : err.message});
    });
};

exports.mod = (req, res) => {
  // res.send({ success: false, msg: 'mod 준비중입니다' });

  const set = req.body;
  if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
  const f = { _id: set._id };
  const s = { $set: set };
  Company.findOneAndUpdate(f, s)
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.del = (req, res) => {
  // res.send({ success: false, msg: 'del 준비중입니다' });

  const { id } = req.query;
  if (!id) return res.send({ success: false, msg: 'id not exists' });
  let cp;
  Company.findOne({ _id: id })
    .then((r) => {
      cp = r;
      return Group.remove({ _id: { $in: r.gr_ids } });
    })
    .then(() => {
      return Company.remove({ _id: id });
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};