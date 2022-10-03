const Order = require("../models/order");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .populate("product")
    .exec()
    .then((doc) => res.status(200).send({ order: doc }))
    .catch((err) => res.status(500).send({ error: err }));
};
