const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");
const mongoose = require("mongoose");

module.exports = {
  authentication: async (req, res, next) => {
    try {
      let token = req.headers["x-api-key"];
      if (!token)
        return res
          .status(401)
          .send({ status: false, message: "Token is missing" });
      let decodedToken = jwt.verify(token, "juju", (err, decode) => {
        if (err) {
          let msg =
            err.message === "jwt expired"
              ? "Token is expired"
              : "Token is invalid";
          return res.status(400).send({ status: false, message: msg });
        }
        req.decode = decode;
        next();
      });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  authorisation: async (req, res, next) => {
    try {
      let userId = req.params.userId;
      if (!userId) {
        return res
          .status(400)
          .send({ status: false, message: "please provide userId" });
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide vaild userId" });
      }
      let user = await userModel.findById(userId);
      if (!user)
        return res
          .status(400)
          .send({ status: false, msg: "User doesn't exists!" });
      if (userId != req.decode.userId) {
        return res
          .status(403)
          .send({ status: false, message: "User is not Authorized" });
      }
      next();
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },
};
