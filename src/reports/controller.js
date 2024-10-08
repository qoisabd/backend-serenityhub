const ReportUser = require('./model');
const path = require('path');
const fs = require('fs');

async function addReport(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    const user = req.user;
    const payload = req.body;
    const newReport = new ReportUser({
      ...payload,
      reporter: user._id,
    });

    await newReport.save();
    if (newReport) {
      return res.json({
        status: 'ok',
        message: 'Berhasil menambahkan laporan',
        idReport: newReport._id,
      });
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

async function getDetailReport(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    const report = await ReportUser.findOne({ _id: req.params.id })
      .populate({
        path: 'comment',
        select: ['message', 'name', 'createdAt'],
      })
      .populate({
        path: 'reporter',
        select: ['_id', 'name'],
      })
      .populate('officerReport')
      .populate({ path: 'unitWorks', select: ['_id ', 'name', 'image'] })
      .select('-__v');
    if (report) {
      res.json({
        status: 'ok',
        data: report,
      });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: 'Laporan tidak ditemukan',
    });
    next(err);
  }
}

async function getAllReport(req, res, next) {
  try {
    let { limit = 8, skip = 0, q = '', status = '' } = req.query;
    let criteria = {};
    if (q.length) {
      criteria = {
        ...criteria,
        title: { $regex: `${q}`, $options: 'i' },
      };
    }
    if (status.length) {
      criteria = {
        ...criteria,
        status: status,
        title: { $regex: `${q}`, $options: 'i' },
      };
    }
    const count = await ReportUser.find(criteria).countDocuments();
    const report = await ReportUser.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate({
        path: 'comment',
        select: ['message', 'name'],
      })
      .select(
        '_id title status description imageReport createdAt address -comment ',
      );
    if (report) {
      res.json({
        status: 'ok',
        count,
        data: report,
      });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
    });
    next(err);
  }
}

async function getAllReportByUnitWorks(req, res, next) {
  try {
    let { limit = 8, skip = 0, q = '', status = '' } = req.query;

    let criteria = {
      unitWorks: req.params.id,
      status: 'Diproses',
    };
    if (q.length || status.length) {
      criteria = {
        ...criteria,
        title: { $regex: `${q}`, $options: 'i' },
      };
    }
    const count = await ReportUser.find(criteria).countDocuments();
    const report = await ReportUser.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate({
        path: 'comment',
        select: ['message', 'name'],
      })
      .select(
        '_id title status description imageReport unitWorks createdAt address -comment ',
      );
    if (report) {
      res.json({
        status: 'ok',
        count,
        data: report,
      });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
    });
    next(err);
  }
}

async function getAllReportByOfficer(req, res, next) {
  try {
    let { limit = 8, skip = 0, q = '', status = '' } = req.query;
    let criteria = {
      officer: req.params.id,
    };
    if (q.length || status.length) {
      criteria = {
        ...criteria,
        title: { $regex: `${q}`, $options: 'i' },
      };
    }
    const count = await ReportUser.find(criteria).countDocuments();

    const report = await ReportUser.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate({
        path: 'comment',
        select: ['message', 'name'],
      })
      .select(
        '_id title status description imageReport unitWorks createdAt address -comment ',
      );
    if (report) {
      res.json({
        status: 'ok',
        count,
        data: report,
      });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
    });
    next(err);
  }
}

async function assignReportToUnitWork(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    const payload = req.body;
    const userRole = req.user.role;
    if (!userRole === 'admin') {
      res.json({
        error: 1,
        message: 'Kamu tidak memiliki akses',
      });
    } else {
      const report = await ReportUser.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { unitWorks: payload.selectedOption, status: 'Diproses' } },
      );
      if (report) {
        return res.json({
          status: 'ok',
          message: 'Unit kerja memiliki laporan',
        });
      }
    }
  } catch (error) {
    return res.json({
      error: 1,
      message: 'Laporan atau unit kerja tidak ditemukan',
    });
  }
}

async function getAllReportCoordinate(req, res, nex) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    if (req.user.role !== 'admin') {
      res.json({
        error: 1,
        message: 'Kamu tidak memiliki akses',
      });
    } else {
      const report = await ReportUser.find().select(
        'latitude longitude _id status',
      );
      if (report) {
        return res.json({
          status: 'ok',
          message: 'List laporan dan unit kerja',
          data: report,
        });
      } else {
        return res.status(500).json({
          error: 1,
          message: 'Gagal',
        });
      }
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: err,
    });
  }
}
async function deleteReport(req, res, next) {
  if (req.user.role !== 'admin') {
    res.json({
      error: 1,
      message: 'Kamu tidak memiliki akses',
    });
  }
  try {
    const deleteReport = await ReportUser.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteReport) {
      return res.json({
        status: 'ok',
        message: 'Berhasil menghapus laporan',
      });
    } else {
      return res.json({
        error: 1,
        message: 'Laporan tidak ditemukan',
      });
    }
  } catch (error) {
    return res.json({
      error: 1,
      message: error,
    });
  }
  next();
}

async function getReportByUser(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    let { limit = 8, skip = 0, q = '', status = '' } = req.query;
    let criteria = {
      reporter: req.params.id,
    };
    if (q.length) {
      criteria = {
        ...criteria,
        title: { $regex: `${q}`, $options: 'i' },
      };
    }
    if (status.length) {
      criteria = {
        ...criteria,
        status: status,
        title: { $regex: `${q}`, $options: 'i' },
      };
    }
    const count = await ReportUser.find(criteria).countDocuments();

    const report = await ReportUser.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate({
        path: 'comment',
        select: ['message', 'name'],
      })
      .select(
        '_id title status description imageReport unitWorks createdAt address -comment ',
      );
    if (report) {
      res.json({
        status: 'ok',
        count,
        data: report,
      });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
    });
    next(err);
  }
}

module.exports = {
  getDetailReport,
  getAllReport,
  addReport,
  deleteReport,
  assignReportToUnitWork,
  getAllReportByUnitWorks,
  getAllReportByOfficer,
  getAllReportCoordinate,
  getReportByUser,
};
