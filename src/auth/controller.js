const User = require('../user/model');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/getToken');
const config = require('../config');

// Officer register

async function officerRegister(req, res, next) {
  const payload = req.body;

  if (req.user.role !== 'admin') {
    res.json({
      error: 1,
      message: 'Kamu tidak memiliki akses',
    });
  }
  try {
    let user = new User({
      ...payload,
      // unitWorks: payload.unitWorks,
    });
    await user.save();
    if (user) {
      return res.json({
        status: 'ok',
        message: 'Berhasil mendaftar',
      });
    }
    // return res.json(user);
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
async function adminRegister(req, res, next) {
  const payload = req.body;
  const secret = config.secretKey;

  if (payload.secretKey !== secret) {
    res.json({
      error: 1,
      message: 'Kode salah',
    });
  }
  try {
    let user = new User({
      ...payload,
      // unitWorks: payload.unitWorks,
    });
    await user.save();
    if (user) {
      return res.json({
        status: 'ok',
        message: 'Berhasil mendaftar',
      });
    }
    // return res.json(user);
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

// User register
async function register(req, res, next) {
  try {
    const payload = req.body;
    let user = new User(payload);
    await user.save();
    if (user) {
      return res.json({
        status: 'ok',
        message: 'Berhasil mendaftar',
      });
    }
    // return res.json(user);
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

async function changeUserPassword(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    const findUser = await User.findOne({ _id: user._id });
    if (bcrypt.compareSync(oldPassword, findUser.password)) {
      const setNewPassword = bcrypt.hashSync(newPassword, 10);
      const updateUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { password: setNewPassword } },
      );
      if (updateUser) {
        return res.json({
          status: 'ok',
          message: 'Password berhasil diubah',
        });
      }
    } else {
      return res.json({
        error: 1,
        message: 'Password lama salah',
      });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: 'Ganti passwword gagal',
    });
  }
}

async function localStrategy(email, password, done) {
  try {
    let user = await User.findOne({
      email,
    }).select(' -__v  -createdAt -updatedAt -token ');

    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());

      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }
  done();
}

async function login(req, res, next) {
  passport.authenticate('local', async function (err, user) {
    if (err) return next(err);
    if (!user)
      return res.json({
        error: 1,
        message: 'Email atau password salah',
      });

    let signed = jwt.sign(user, config.secretKey);
    await User.findOneAndUpdate(
      { _id: user._id },
      // agar bisa input token lebih dari satu, sehingga user bisa login perangkat yang berbeda
      // { $push: { token: signed } },

      //  hanya bisa login di satu perangkat, karena token hanya 1 saja
      { $set: { token: signed } },
      { new: true },
    );
    return res.json({
      status: 'ok',
      message: 'Login sukses',
      user: user,
      token: signed,
    });
  })(req, res, next);
}

function me(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  return res.json(req.user);
}

async function logout(req, res, next) {
  let token = getToken(req);
  const user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false },
  );
  if (!user || !token) {
    return res.json({
      error: 1,
      message: 'User tidak ditemukan',
    });
  }

  return res.json({
    error: 0,
    message: 'Berhasil keluar',
  });
}

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout,
  changeUserPassword,
  officerRegister,
  adminRegister,
};
