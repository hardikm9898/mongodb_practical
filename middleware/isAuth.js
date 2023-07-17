const jwt = require("jsonwebtoken");
require("dotenv").config();
const { statusCode, message } = require("../constant/constant");

const { error } = require("../response-api/responseApi");

const isAuth = (req, res, next) => {
  try {
    const rawToken = req.headers.authorization;
    if (!rawToken) {
      res
        .status(statusCode.FORBIDDEN)
        .json(error(message.NOT_AUTHORIZE, res.statusCode));
    } else {
      const token = rawToken.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY, {
        expiresIn: "2h",
      });

      req.user = decoded.user;
      return next();
    }
  } catch (err) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .json(error(message.INVALID_TOKEN, res.statusCode));
  }
};

module.exports = isAuth;
