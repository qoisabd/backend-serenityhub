const UnitWork = require('./model');

async function addUnitWork(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `You're not not login or token expired`,
    });
  }
  try {
    const payload = req.body;
    const userRole = req.user.role;
    if (userRole === 'user') {
      res.json({
        error: 1,
        message: 'your not allowed access',
      });
    } else {
      const newUnitWork = new UnitWork({ ...payload });
      await newUnitWork.save();
      if (newUnitWork) {
        return res.json({
          status: 'ok',
          message: 'add category sucessuflly',
          categoryId: newUnitWork._id,
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

async function deleteUnitWork(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `You're not not login or token expired`,
    });
  }
  try {
    const userRole = req.user.role;

    if (userRole === 'user') {
      res.json({
        error: 1,
        message: 'your not allowed access',
      });
    } else {
      let unitWork = await UnitWork.findOneAndDelete({ _id: req.params.id });

      if (unitWork) {
        return res.json({
          status: 'ok',
          message: 'delete unit work successfully',
        });
      }
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: 'unit work not found',
    });
  }
}

async function getUnitWork(req, res, nex) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `You're not not login or token expired`,
    });
  }

  try {
    const userRole = req.user.role;

    if (userRole === 'user') {
      res.json({
        error: 1,
        message: 'your not allowed access',
      });
    }
    const unitWork = await UnitWork.find();
    if (unitWork) {
      return res.json({
        status: 'ok',
        data: unitWork,
      });
    }
  } catch (error) {}
}
module.exports = { addUnitWork, deleteUnitWork, getUnitWork };
