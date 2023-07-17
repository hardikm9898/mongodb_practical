const express = require("express");
const { error } = require("../response-api/responseApi");
const { statusCode, message } = require("../constant/constant");

const router = express.Router();

router.use((req, res) => {
  res
    .status(statusCode.UNAUTHORIZED)
    .json(error(message.NOT_FOUND, res.statusCode));
});

module.exports = router;
