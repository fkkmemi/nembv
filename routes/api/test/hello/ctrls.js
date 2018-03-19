exports.plz = (req, res) => {
  throw new Error('sad...')
  res.send({ success: true, msg: '여기까지 오느라 힘들었죠?' });
};
