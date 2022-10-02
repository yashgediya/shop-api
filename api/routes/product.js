const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./upload/"),
  filename: (req, file, cb) =>
    cb(null, new Date().toISOString() + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  }
  cb(null, false);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", upload.single("productImage"), (req, res) => {
  console.log(req.file);
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((response) => {
      res.status(201).send({
        message: "Handling GET request to /products",
        createproduct: response,
      });
    })
    .catch((e) => {
      res.status(500).send({
        e,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.updateOne(
    { _id: id },
    { $set: { name: req.body.name, price: req.body.price } }
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
