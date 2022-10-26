const express = require("express");
const router = express.Router();
const { Auth } = require("../middlewares/auth");
const userController = require("../controllers/User");

router.post("/create",Auth, userController.CREATE_NEW_USER);

// router.get("/me", userController.SIGN_IN);
router.post("/me", userController.SIGN_IN);

module.exports = router;
