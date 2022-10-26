exports.Auth = (req, res, next) => {
  const token = req.header("Authorization")
    ? req.header("Authorization").substring(5)
    : null;
  if (!token) {
    return res.status(400).send({ response: "Please Autheticate" });
  }
  next();
};
