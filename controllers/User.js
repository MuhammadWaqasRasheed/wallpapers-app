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

  // validating User input
  if (
    commonUtil.isNullOrEmptystring(name) ||
    commonUtil.isNullOrEmptystring(email) ||
    commonUtil.isNullOrEmptystring(password)
  ) {
    return res.status(400).send({ error: "Invalid Form data" });
  }

  try {
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
    res.status(500).send({
      error: error,
    });
  }
};

exports.SIGN_IN = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  // validating User input
  if (
    commonUtil.isNullOrEmptystring(email) ||
    commonUtil.isNullOrEmptystring(password)
  ) {
    return res.status(400).send({ error: "Invalid Credentials Provided" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).send({ error: "Invalid Email or Password" });
    // now verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res
        .status(400)
        .send({ error: "Invalid Email or Password", isMatch });
    }
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (error) {
    res.status(500).send({ error });
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
