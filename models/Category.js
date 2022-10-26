const mongoose = require("mongoose");
const { CATEGORY_MODEL } = require("../Util/modelConstants");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(CATEGORY_MODEL, categorySchema);
