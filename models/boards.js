const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  ut: { type: Date, default: Date.now }, // 변경 날짜 : timestamp
  ip: { type: String, default: '' }, // ip address
  id: { type: String, default: '' }, // 작성자
  title: { type: String, default: '제목 없음', index: true }, // 제목
  content: { type: String, default: '' }, // 글
  cntView: { type: Number, default: 0 }, // 조회수
  cntLike: { type: Number, default: 0 }, // 좋아요수
  cmt_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // 댓글
});

module.exports = mongoose.model('Board', boardSchema);
