const mongoose = require("mongoose");

const Product = require("../model/product");
// const User=require("../model/user-model")
const { success, error } = require("../response-api/responseApi");
const { statusCode, message } = require("../constant/constant");
const User = require("../model/user-model");

// ? Input : Title , Price, Description --- Output : Add Product to the Product Database

const addProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const imageUrl = req.file.path;

    const product = new Product({
      title,
      price,
      description,
      imageUrl,
      userId: req.user._id,
    });
    await product.save();
    res
      .status(statusCode.CREATED)
      .json(success("success", message.ADD_PRODUCT, res.statusCode));
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(error(message.SERVER_ERROR, res.statusCode));
  }
};

// ? Output : Page with all products

const getProductList = async (req, res) => {
  try {
    let { size, page, limit } = req.query;

    if (!size) {
      size = 10;
    }
    if (!page) {
      page = 1;
    }
    limit = +size;
    const products = await Product.find()
      .sort("price")
      .skip((page - 1) * size)
      .limit(limit);
    return res
      .status(statusCode.SUCCESS)
      .json(success("success", { page, size, products }, res.statusCode));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(error(message.SERVER_ERROR, res.statusCode));
  }
};
// ? Input: ProductID, EditMode --- Output: Edit Page with Data Populated

const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (product) {
      return res
        .status(statusCode.SUCCESS)
        .json(success("success", { product }, res.statusCode));
    }
    res
      .status(statusCode.NOT_FOUND)
      .json(error(message.PRODUCT_NOT_FOUND, res.statusCode));
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(error(message.SERVER_ERROR, res.statusCode));
  }
};

// ? Input: PID,title,price, description --- Output: UpdateThe Existed Data

const updateProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const { productId } = req.params;
    const checkProduct = await Product.findById(productId);

    if (checkProduct) {
      await Product.updateOne(
        { _id: productId },
        { title, price, description }
      );
      return res
        .status(statusCode.SUCCESS)
        .json(success("success", message.DATA_UPDATED));
    }
    res
      .status(statusCode.NOT_FOUND)
      .json(error(message.PRODUCT_NOT_FOUND, res.statusCode));
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(error(message.SERVER_ERROR, res.statusCode));
  }
};

// ? Input: PID --- Output: Delete The Data

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const checkProduct = await Product.findById(productId);
    if (checkProduct) {
      await Product.deleteOne({ _id: productId });
      return res
        .status(statusCode.SUCCESS)
        .json(success("success", message.DATA_DELETED, res.statusCode));
    }
    res
      .status(statusCode.NOT_FOUND)
      .json(error(message.PRODUCT_NOT_FOUND, res.statusCode));
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(error(message.SERVER_ERROR, res.statusCode));
  }
};

// ? Add sorting and searching functionalities.

const sortProduct = async (req, res) => {
  try {
    const { name } = req.params;
    const sortData = await Product.aggregate([{ $sort: { [name]: 1 } }]);
    return res
      .status(statusCode.SUCCESS)
      .json(success("success", { message: sortData }, res.statusCode));
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(error(message.SERVER_ERROR, res.statusCode));
  }
};

// ? searching by functionalities

const searchProduct = async (req, res) => {
  try {
    const { searchKey } = req.params;

    const searchData = await Product.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: new RegExp(searchKey, "ig") } },
            { description: { $regex: new RegExp(searchKey, "ig") } },
          ],
        },
      },
    ]);

    if (searchData.length) {
      return res
        .status(statusCode.SUCCESS)
        .json(success("success", { message: searchData }, res.statusCode));
    }
    res
      .status(statusCode.NOT_FOUND)
      .json(error(message.PRODUCT_NOT_FOUND, res.statusCode));
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(error(message.SERVER_ERROR, res.statusCode));
  }
};

// ? Add projection and grouping to get extract data from collection.

// ? upon product who added this product

const groupingAndProjectionData = async (req, res) => {
  try {
    const { title } = req.params;

    const product = await Product.aggregate([
      { $match: { title } },
      { $project: { title: 1 } },
      { $group: { _id: { title: "$title" }, count: { $count: {} } } },
    ]);

    if (!product.length) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(error(message.PRODUCT_NOT_FOUND, res.statusCode));
    }
    res
      .status(statusCode.SUCCESS)
      .json(success("success", { message: product }, res.statusCode));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(error(message.SERVER_ERROR, res.statusCode));
  }
};

module.exports = {
  deleteProduct,
  updateProduct,
  getSingleProduct,
  getProductList,
  addProduct,
  sortProduct,
  searchProduct,
  groupingAndProjectionData,
};
