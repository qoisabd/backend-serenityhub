const { getToken } = require('../utils/getToken');
const jwt = require('jsonwebtoken');
const User = require('../user/model');
const config = require('../config');

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);
      //   jika request tidak memiliki token maka
      if (!token) return next();
      req.user = jwt.verify(token, config.secretKey);

      let user = await User.findOne({ token: { $in: [token] } }).select(
        '-__v -createdAt -updatedAt -car_items  -token -password',
      );
      if (!user) {
        return res.json({
          error: 1,
          message: 'Token kadaluwarsa',
        });
      }
    } catch (err) {
      if (err && err.name === 'JsonWebTokenError') {
        return res.json({
          error: 1,
          message: err.message,
        });
      }
      next(err);
    }
    return next();
  };
}

module.exports = {
  decodeToken,
};
