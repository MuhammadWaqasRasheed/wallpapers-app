const { JsonWebTokenError } = require("jsonwebtoken");
const { JWT_SECRET_CODE } = require("../Util/Constants");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.Auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
      ? req.header("Authorization").substring(7)
      : null;
    req.token = token;
    // find user
    const decoded = jwt.verify(token, JWT_SECRET_CODE);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("Please authenticate");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
