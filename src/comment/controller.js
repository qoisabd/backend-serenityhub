const Comment = require('./model');
const ReportUser = require('../reports/model');

async function addComment(req, res, next) {
  let user = req.user;

  if (!user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    const payload = req.body;
    let comment = new Comment({ ...payload, name: user.name });
    const commentReport = await ReportUser.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comment: comment._id } },
    );
    await comment.save();
    if (comment) {
      return res.json({
        status: 'ok',
        message: 'Berhasil menambahkan komentar',
        idComment: comment._id,
      });
    }
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

async function deleteComment(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    const payload = req.body;
    let user = req.user;
    let comment = await Comment.findOneAndDelete({ _id: req.params.id });
    if (comment) {
      return res.json({
        status: 'ok',
        message: 'Komentar berhasil dihapus',
      });
    }
    return res.json({
      error: 1,
      message: 'Komentar tidak ditemukan',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { addComment, deleteComment };
