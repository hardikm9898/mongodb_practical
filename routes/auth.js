const express = require("express");

const router = express.Router();
const validator = require("../middleware/validation");
const { signUpSchema, loginSchema } = require("../validator/validate");

const { register, login } = require("../controller/auth");

router.post("/register", validator(signUpSchema), register);

router.post("/login", validator(loginSchema), login);

module.exports = router;
