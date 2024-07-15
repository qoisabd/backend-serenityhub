const Comment = require('./model');
const ReportUser = require('../reports/model');

async function addComment(req, res, next) {
  let user = req.user;

  if (!user) {
    return res.json({
      error: 1,
      message: `You're not not login or token expired`,
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
        message: 'comment added',
        idComment: comment._id,
      });
    }
    return res.json({
      error: 1,
      message: `You're not not login or token expired`,
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
      message: `You're not not login or token expired`,
    });
  }
  try {
    const payload = req.body;
    let user = req.user;
    let comment = await Comment.findOneAndDelete({ _id: req.params.id });
    if (comment) {
      return res.json({
        status: 'ok',
        message: 'comment successfully deleted',
      });
    }
    return res.json({
      error: 1,
      message: 'comment not found',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { addComment, deleteComment };
