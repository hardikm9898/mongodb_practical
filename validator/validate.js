const joi = require("joi");

const schema = {
  productSchema: joi.object().keys({
    title: joi.string().required(),
    description: joi.string().min(5).max(150).required(),
    price: joi.number().required(),
  }),
  loginSchema: joi.object().keys({
    email: joi.string().min(3).required().email(),
    password: joi.string().min(6).required(),
  }),
  signUpSchema: joi.object().keys({
    userName: joi.string().min(5).required(),
    name: joi.string().min(5).required(),
    email: joi.string().min(3).required().email(),
    address: joi.object().min(3).required(),
    phone: joi.number().min(10).required(),
    password: joi.string().alphanum().min(6).required(),
  }),
};
module.exports = schema;
