const ReportUser = require('../reports/model');
const OfficerReport = require('./model');

async function addReport(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `You're not not login or token expired`,
    });
  }
  try {
    const payload = req.body;
    console.log(payload);
    const user = req.user;
    if (user.role === 'user') {
      res.json({
        error: 1,
        message: 'your not allowed access',
      });
    } else {
      const id = req.params.id;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const newOfficerReport = new OfficerReport({
          ...payload,
          officer: user._id,
        });
        await newOfficerReport.save();
        await ReportUser.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { officerReport: newOfficerReport._id, officer: req.user._id, status: 'Selesai' } },
        );
        if (newOfficerReport) {
          res.json({
            status: 'ok',
            message: 'report sent successfully',
            idReport: newOfficerReport._id,
          });
        }
      } else {
        return res.json({
          error: 1,
          message: 'report not found',
        });
      }
    }
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

module.exports = {
  addReport,
};
