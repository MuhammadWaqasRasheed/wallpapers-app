const mongoose = require("mongoose");
const { WALLPAPERS_MODEL } = require("../Util/modelConstants");
const sharp = require("sharp");

const wallpaperSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: Buffer,
      required: true,
    },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

wallpaperSchema.pre("save", async function (next) {
  const wallpaper = this;
  // if (user.isModified("image")) {
  //   wallpaper.image = await sharp(wallpaper.image).png().toBuffer();
  // }
  wallpaper.image = await sharp(wallpaper.image).png().toBuffer();
  next();
});

module.exports = mongoose.model(WALLPAPERS_MODEL, wallpaperSchema);
