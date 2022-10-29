const User = require("../models/User");
const { BCRYPT_ALGO_ITREATIONS } = require("../Util/Constants");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const commonUtil = require("../Util/commonUtilities");

exports.CREATE_NEW_USER = async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let isAdmin = req.body.isAdmin;

  try {
    // validating User input
    if (
      commonUtil.isNullOrEmptystring(name) ||
      commonUtil.isNullOrEmptystring(email) ||
      commonUtil.isNullOrEmptystring(password)
    ) {
      throw new Error("Invalid Form data");
    }

    // creating new user
    let newUser = new User({
      name,
      email,
      passwordHash: password,
      isAdmin,
    });
    newUser = await newUser.save();
    return res.send(newUser);
  } catch (error) {
    res.status(400).send({
      error: error,
    });
  }
};

exports.SIGN_IN = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.LOGOUT = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    return res.send(req.user);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.LOGOUT_ALL = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    return res.send();
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.DELETE_ALL = async (req, res) => {
  try {
    await User.deleteMany({ isAdmin: { $eq: true } });
  } catch (error) {
    return res.status(500).send({ error });
  }
  res.send("All users Deleted Successfully");
};
