const Board = require('../../../../models/boards');
const Comment = require('../../../../models/comments');

exports.list = (req, res) => {
  return res.send({ success: false, msg: '댓글만 보고 싶을때 기능 추후 추가'});
};

exports.add = (req, res) => {
  const { bd_id, id,  content } = req.body;

  if (!id) res.send({ success: false, msg : 'id not exists' });
  if (!content) res.send({ success: false, msg : 'content not exists' });

  const cmt = new Comment({
    bd_id: bd_id,
    id: id,
    content: content,
    ip: req.ip,
  });
  cmt.save()
    .then((r) => {
      const f = { _id: r.bd_id };
      const s = { $addToSet: { cmt_ids: r._id } };
      return Board.updateOne(f, s);
    })
    .then((r) => {
      if (!r.nModified) return res.send({ success: false, msg : 'already Board' });
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
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

  Comment.findOneAndUpdate(f, s)
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg: err.message });
    });
};

exports.del = (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.send({ success: false, msg : 'param id not exists' });
  Comment.findOne({_id:_id})
    .then((r) => {
      if (!r) throw new Error('group not exists');
      const f = { _id: r.bd_id };
      const s = { $pull: { cmt_ids: r._id } };
      return Board.updateOne(f, s);
    })
    .then(() => { // { n: 1, nModified: 1, ok: 1 }
      return Comment.remove({ _id: _id });
    })
    .then(() => { // { n: 1, ok: 1 }
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false, msg : err.message });
    });
}