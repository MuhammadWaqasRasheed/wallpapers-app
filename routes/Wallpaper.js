const express = require("express");
const router = express.Router();
const wallpaperController = require("../controllers/Wallpaper");
const { Auth } = require("../middlewares/auth");

const multer = require("multer");

const upload = multer({});

//create a wallpaper
router.post("/", Auth, wallpaperController.CREATE_NEW_WALLPAPER);

router.get("/:id", wallpaperController.GET_WALLPAPER_BY_ID);
router.get("/", wallpaperController.GET_WALLPAPER_LIST);

router.delete("/:id", Auth, wallpaperController.DELETE_WALLPAPER_BY_ID);

router.put(
  "/:id",
  Auth,
  upload.single("image"),
  wallpaperController.UPDATE_WALLPAPER_BY_ID,
  wallpaperController.ERROR_HANDLER
);

storageUpload = multer({});

router.post(
  "/test",
  // Auth,
  // upload.single("image"),
  wallpaperController.TEST_ROUTE
);

// get wallpaper by id
// router.get("/:id", wallpaperController.SIGN_IN);

// update wallpaper

//delete wallpapers

module.exports = router;
