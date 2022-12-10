const userSchema = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  validEmail,
  validPhoneNo,
  isValidPassword,
} = require("../validation/userValidation");

module.exports = {
  createUser: async (req, res) => {
    try {
      let data = req.body;
      let { email, phone, password } = data;
      if (!validEmail(email))
        return res
          .status(400)
          .send({ status: false, message: "Please provide a valid email" });
      if (!validPhoneNo(phone))
        return res
          .status(400)
          .send({ status: false, message: "Please provide a valid phone no." });
      if (!isValidPassword(password))
        return res.status(400).send({
          status: false,
          msg: "Length of the Password can be 8 to 15 !",
        });
      let saltRound = 10;
      data.password = await bcrypt.hash(password, saltRound);
      let userCreation = await userSchema.create(data);
      return res.status(201).send({ status: true, data: userCreation });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      let data = req.body;
      let { email, password, phone } = data;
      let user = await userSchema.findOne({ $or: [{ email }, { phone }] });
      if (!validEmail(email))
        return res
          .status(400)
          .send({ status: false, message: "Please provide a valid email" });
      if (!validPhoneNo(phone))
        return res
          .status(400)
          .send({ status: false, message: "Please provide a valid phone no." });
      let passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch)
        return res
          .status(400)
          .send({
            status: false,
            message: "Incorrect E-mail and Password combination!",
          });
      let generateToken = jwt.sign(
        {
          userId: user._id,
          password: password,
        },
        "juju",
        { expiresIn: "10hr" }
      );
      return res.status(200).send({
        status: true,
        message: "User logged in successfully",
        token: generateToken,
      });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },
};
