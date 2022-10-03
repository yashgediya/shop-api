const { response } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const Order = require("../models/order");
const OrderController = require("../controllers/order");

router.get("/", checkAuth, OrderController.orders_get_all);

router.post("/", checkAuth, (req, res) => {
  const order = new Order({
    product: req.body.product,
    quentity: req.body.quentity,
  });

  order
    .save()
    .then((doc) =>
      res.status(200).json({
        message: "Handling GET request to /order",
        createOrder: doc,
      })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.findById({ _id: id })
    .populate("product")
    .exec()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(500).send({ error: err }));
});

router.patch("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.updateOne(
    { _id: id },
    { $set: { product: req.body.product, quentity: req.body.quentity } }
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(500).send({ error: err }));
});

module.exports = router;
