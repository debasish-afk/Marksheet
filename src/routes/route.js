const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const marksController = require("../controller/marksController");
const middlewear = require("../middlewear/auth");

router.post("/registerUser", userController.createUser);
router.get("/loginUser", userController.login);
router.post(
  "/studentMarks/:userId",
  middlewear.authentication,
  middlewear.authorisation,
  marksController.studentMarks
);
router.get("/getStudent", marksController.getMarks);
// router.put("/addMarks", marksController.addMarks);
router.put(
  "/editDetails/:studentId/:userId",
  middlewear.authentication,
  middlewear.authorisation,
  marksController.editDetails
);
router.delete(
  "/deleteMarks/:userId/:studentId",
  middlewear.authentication,
  middlewear.authorisation,
  marksController.deleteStudent
);

module.exports = router;
