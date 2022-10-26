const Wallpaper = require("../models/Wallpaper");
const commonUtil = require("../Util/commonUtilities");

exports.CREATE_NEW_WALLPAPER = async (req, res) => {
  let name = req.body.name;
  let image = req.file ? req.file.buffer : null;
  let category = req.body.category;
  let user = req.body.user;

  // validating User input
  if (
    commonUtil.isNullOrEmptystring(name) ||
    commonUtil.isNullOrEmptystring(category) ||
    commonUtil.isNullOrEmptystring(user) ||
    !image
  ) {
    return res.status(400).send({ error: "Invalid Form data" });
  }

  try {
    // creating new Wallpaper
    let newWallpaper = new Wallpaper({
      name,
      category,
      image,
      user,
    });
    newWallpaper = await newWallpaper.save();
    return res.send(newWallpaper);
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
};

exports.GET_WALLPAPER_LIST = async (req, res) => {
  try {
    const wallpaperList = await Wallpaper.find({});

    res.send({
      count: wallpaperList.length,
      data: wallpaperList,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.GET_WALLPAPER_BY_ID = async (req, res) => {
  const id = req.params.id;
  if (commonUtil.isNullOrEmptystring(id)) {
    return res.status(400).send("Invalid Object Id");
  }
  try {
    const wallpaper = await Wallpaper.findById(id);
    if (!wallpaper) {
      return res.status(404).send("Object not found.");
    }

    return res.send(wallpaper);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.DELETE_WALLPAPER_BY_ID = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedWallpaper = await Wallpaper.findByIdAndDelete(id);
    if (!deletedWallpaper) {
      return res.status(400).send("Invalid Object Id.");
    }
    res.send(deletedWallpaper);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.ERROR_HANDLER = async (error, req, res) => {
  res.status(400).send({ Error: error.message });
};

exports.UPDATE_WALLPAPER_BY_ID = async (req, res) => {
  const id = req.params.id;
  const allowedUpdates = ["name", "image", "category", "user"];
  try {
    // deleting garbage data if sent with request
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.indexOf(key) == -1) {
        delete req.body[key];
      } else if (commonUtil.isNullOrEmptystring(req.body[key])) {
        return res
          .status(400)
          .send({ error: `${key} cannot null or empty string.` });
      }
    });

    // now check image update
    req.file ? (req.body["image"] = req.file.buffer) : null;

    const updatedWallpaper = await Wallpaper.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (!updatedWallpaper) {
      return res.status(400).send("Invalid Object Id.");
    }
    res.send(updatedWallpaper);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ error: "Invalid Object ID." });
    }
    res.status(500).send(err);
  }
};
