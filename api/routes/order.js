const { response } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");

router.get("/", (req, res, next) => {
  Order.find()
    .populate("product")
    .exec()
    .then((doc) => res.status(200).send(doc))
    .catch((err) => res.status(500).send({ error: err }));
});

router.post("/", (req, res) => {
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

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById({ _id: id })
    .populate("product")
    .exec()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(500).send({ error: err }));
});

router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.updateOne(
    { _id: id },
    { $set: { product: req.body.product, quentity: req.body.quentity } }
  )
    .exec()
    .then((result) => {
      console.log("============", result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("============", err);

      res.status(500).json({ error: err });
    });
});

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(500).send({ error: err }));
});

module.exports = router;
