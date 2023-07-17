const express = require("express");

const {
  getCart,
  postCart,
  order,
  getInvoice,
  userFilterByName
} = require("../controller/user-controller");

const router = express.Router();

router.post("/cart/:productId", postCart);
router.get("/invoice/:orderId", getInvoice);
router.get("/cart", getCart);
router.post("/order", order);
router.get("/:name", userFilterByName);

module.exports = router;
