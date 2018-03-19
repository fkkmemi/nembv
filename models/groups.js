const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  name: { type: String, index: true }, // 이름
  ut: { type: Date, default: Date.now }, // 변경 날짜 : timestamp
  cp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // 지정된 회사
  rmk: { type: String, default: '' }, // 리마크 : 설명
});

module.exports = mongoose.model('Group', groupSchema);
