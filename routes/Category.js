const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/Category");
const { Auth } = require("../middlewares/auth");

//create a wallpaper
router.post("/", Auth, categoryController.createCategory);

router.get("/:id", categoryController.GET_Category_BY_ID);
router.get("/", categoryController.GET_All_Categories);

router.delete("/", Auth, categoryController.DELETE_CATEGORY_BY_ID);

// router.put(
//   "/:id",
//   Auth,
//   upload.single("image"),
//   categoryController.UPDATE_WALLPAPER_BY_ID,
//   categoryController.ERROR_HANDLER
// );

// get wallpaper by id
// router.get("/:id", wallpaperController.SIGN_IN);

// update wallpaper

//delete wallpapers

module.exports = router;
