const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  address: {
    street: { type: String, require: true },

    city: {
      type: String,
      require: true,
    },
    zipcode: {
      type: Number,
      require: true,
    },
  },
  phone: {
    type: Number,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        qty: { type: Number, required: true },
      },
    ],
  },
});
module.exports = mongoose.model("Users", userSchema);
