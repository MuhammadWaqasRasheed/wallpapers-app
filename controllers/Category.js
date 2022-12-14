const Category = require("../models/Category");
const commonUtil = require("../Util/commonUtilities");

exports.createCategory = async (req, res) => {
  let name = req.body.name;

  // validating User input
  if (commonUtil.isNullOrEmptystring(name)) {
    return res.status(400).send({ error: "Invalid Form data" });
  }

  try {
    // creating new Category
    let newCategory = new Category({
      name,
    });
    newCategory = await newCategory.save();
    return res.send(newCategory);
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
};

exports.GET_All_Categories = async (req, res) => {
  // let limit = !commonUtil.isNullOrEmptystring(req.query.limit)
  //   ? parseInt(req.query.limit)
  //   : 6;
  // let skip = !commonUtil.isNullOrEmptystring(req.query.skip)
  //   ? parseInt(req.query.skip)
  //   : 0;

  try {
    const CategoryList = await Category.find({}).sort({ createdAt: -1 });
    // .skip(skip)
    // .limit(limit);

    res.send({
      count: CategoryList.length,
      data: CategoryList,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.GET_Category_BY_ID = async (req, res) => {
  const id = req.params.id;
  if (commonUtil.isNullOrEmptystring(id)) {
    return res.status(400).send("Invalid Object Id");
  }
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send("Object not found.");
    }

    return res.send(category);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.DELETE_CATEGORY_BY_ID = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(400).send("Invalid Object Id.");
    }
    res.send(deletedCategory);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.UPDATE_CATEGORY_BY_ID = async (req, res) => {
  console.log("category route working.")
  const id = req.params.id;
  const allowedUpdates = ["name"];
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

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (!updatedCategory) {
      return res.status(400).send("Invalid Object Id.");
    }
    res.send(updatedCategory);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ error: "Invalid Object ID." });
    }
    res.status(500).send(err);
  }
};
