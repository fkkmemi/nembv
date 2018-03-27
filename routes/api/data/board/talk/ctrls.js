const mongoose = require('mongoose');
const Board = require('../../../../../models/boards');
const Comment = require('../../../../../models/comments');

const Talk = mongoose.model('Talk', Board.schema);
const TalkComment = mongoose.model('TalkComment', Comment.schema);

exports.list = (req, res) => {
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

  const d = {
    draw: draw,
    cnt: 0,
    ds: [],
  };

  Talk.count()
    .where('title').regex(search)
    .then((c) => {
      d.cnt = c;
      const s = {}
      s[order] = sort;
      return Talk.find()
        .where('title').regex(search)
        .select('ut id title cntView cmt_ids')
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


exports.read = (req, res) => {
  const f = { _id: req.params._id };
  const s = { $inc: { cntView: 1 } };
  const o = { new: true };
  Talk.findOneAndUpdate(f, s, o)
    // .where('_id').equals(_id)
    // .select('content')
    .populate('cmt_ids')
    .then((d) => {
      res.send({success: true, d: d});
    })
    .catch((err) => {
      res.send({success: false, msg : err.message});
    });
};

exports.add = (req, res) => {
  const { id, title, content } = req.body;

  if (!id) res.send({success: false, msg : 'id not exists'});
  if (!content) res.send({success: false, msg : 'content not exists'});

  const bd = new Talk({
    id: id,
    title: title,
    content: content,
    ip: req.ip,
  });
  bd.save()
    .then(() => {
      res.send({success: true});
    })
    .catch((err) => {
      res.send({success: false, msg : err.message});
    });
};

exports.mod = (req, res) => {
  const set = req.body;

  if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
  if (!set._id) return res.send({ success: false, msg: 'id not exists' });
  set.ut = new Date();
  set.ip = req.ip;

  const f = { _id: set._id };
  const s = { $set: set };

  Talk.findOneAndUpdate(f, s)
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.del = (req, res) => {
  const { _id } = req.query;

  if (!_id) return res.send({ success: false, msg: 'id not exists' });
  let cp;
  Talk.findOne({ _id: _id })
    .then((r) => {
      cp = r;
      return TalkComment.remove({ _id: { $in: r.cmt_ids } });
    })
    .then(() => {
      return Talk.remove({ _id: _id });
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.addCmt = (req, res) => {
  const { bd_id, id,  content } = req.body;

  if (!id) res.send({ success: false, msg : 'id not exists' });
  if (!content) res.send({ success: false, msg : 'content not exists' });

  const cmt = new TalkComment({
    bd_id: bd_id,
    id: id,
    content: content,
    ip: req.ip,
  });
  cmt.save()
    .then((r) => {
      const f = { _id: r.bd_id };
      const s = { $addToSet: { cmt_ids: r._id } };
      return Talk.updateOne(f, s);
    })
    .then((r) => {
      if (!r.nModified) return res.send({ success: false, msg : 'already Talk' });
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
};

exports.modCmt = (req, res) => {
  const set = req.body;

  if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
  if (!set._id) return res.send({ success: false, msg: 'id not exists' });
  set.ut = new Date();
  set.ip = req.ip;

  const f = { _id: set._id };
  const s = { $set: set };

  TalkComment.findOneAndUpdate(f, s)
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.delCmt = (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.send({ success: false, msg : 'param id not exists' });
  TalkComment.findOne({_id:_id})
    .then((r) => {
      if (!r) throw new Error('group not exists');
      const f = { _id: r.bd_id };
      const s = { $pull: { cmt_ids: r._id } };
      return Talk.updateOne(f, s);
    })
    .then(() => { // { n: 1, nModified: 1, ok: 1 }
      return TalkComment.remove({ _id: _id });
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
}