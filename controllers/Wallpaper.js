const Wallpaper = require("../models/Wallpaper");
const commonUtil = require("../Util/commonUtilities");

exports.CREATE_NEW_WALLPAPER = async (req, res) => {
  try {
    if (
      commonUtil.isNullOrEmptystring(req.body.name) ||
      commonUtil.isNullOrEmptystring(req.body.imageURL)
    ) {
      throw new Error("Invalid Form data");
    }

    // creating new Wallpaper
    let newWallpaper = new Wallpaper({
      name: req.body.name,
      imageURL: req.body.imageURL,
      category: req.body.category,
      user: req.user._id,
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
  let limit = !commonUtil.isNullOrEmptystring(req.query.limit)
    ? parseInt(req.query.limit)
    : 6;
  let skip = !commonUtil.isNullOrEmptystring(req.query.skip)
    ? parseInt(req.query.skip)
    : 0;
  try {
    const wallpaperList = await Wallpaper.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
  const allowedUpdates = ["name", "imageURL", "category"];
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
    res.status(500).send(err);
  }
};

exports.TEST_ROUTE = (req, res) => {
  res.send("test route");
};
