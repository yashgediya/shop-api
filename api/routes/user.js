const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { response } = require("../../app");

router.post("/signup", (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).send({ message: "User already exist" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({ error: err });
          } else {
            const user = new User({
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((doc) => res.status(200).send({ message: "User Created" }))
              .catch((err) => res.status(500).send({ error: err }));
          }
        });
      }
    });
});

router.post("/login", (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).send({ message: "Authentication failed" });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).send({ message: "Authentication failed" });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "secret",
            { expiresIn: "1h" }
          );

          return res.status(200).send({
            message: "Authentication successful",
            token: token,
          });
        }
        res.status(401).send({ message: "Authentication failed" });
      });
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
});

router.delete("/:userId", (req, res) => {
  const userId = req.params.userId;
  User.remove({ _id: userId })
    .exec()
    .then((respose) => {
      res.status(200).send({ message: "User deleted" });
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
});

module.exports = router;
