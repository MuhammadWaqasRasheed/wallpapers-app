const express = require("express");
const router = express.Router();
const { Auth } = require("../middlewares/auth");
const userController = require("../controllers/User");

router.post("/signUp", Auth, userController.CREATE_NEW_USER);

// router.get("/me", userController.SIGN_IN);
router.post("/login", userController.SIGN_IN);
router.post("/logout/all", Auth, userController.LOGOUT_ALL);
router.post("/logout", Auth, userController.LOGOUT);

module.exports = router;
