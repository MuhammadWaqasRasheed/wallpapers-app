const mongoose = require("mongoose");
const { USER_MODEL } = require("../Util/modelConstants");
const {
  BCRYPT_ALGO_ITREATIONS,
  JWT_SECRET_CODE,
} = require("../Util/Constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: {
      type: Buffer,
    },
    isAdmin: {
      type: Boolean,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.tokens;
  delete userObject.passwordHash;
  delete userObject._id;
  delete userObject.__v;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET_CODE);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// userSchema.methods.findByCredentials

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("passwordHash")) {
    user.passwordHash = await bcrypt.hash(
      user.passwordHash,
      BCRYPT_ALGO_ITREATIONS
    );
  }

  next();
});

module.exports = mongoose.model(USER_MODEL, userSchema);
