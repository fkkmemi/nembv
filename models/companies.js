const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, index: true }, // 이름
  ut: { type: Date, default: Date.now }, // 변경 날짜 : timestamp
  pos: { // 위치 lat,lng로 해야 구글에서 바로 쓰기 좋다
    lat: { type: Number, default: 37.1 },
    lng: { type: Number, default: 127.1 },
  },
  type: { type: Number, default: 0 }, // 추후 용도
  rmk: { type: String, default: '신규' }, // 리마크 : 설명
  gr_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }], // 포함될 그룹들
});

module.exports = mongoose.model('Company', companySchema);
