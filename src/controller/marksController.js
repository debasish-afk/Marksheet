const marksModel = require("../models/marksSchema");
const mongoose = require("mongoose");
const { objectValue } = require("../validation/userValidation");

module.exports = {
  studentMarks: async (req, res) => {
    try {
      let data = req.body;
      let { name, subject, userId, marks } = data;
      if (!name)
        return res
          .status(400)
          .send({ status: false, message: "Please provide a name" });
      let sub = ["Maths", "English", "Science"];
      if (!sub.includes(subject))
        return res.status(400).send({
          status: false,
          message: "Please provide available subjects",
        });
      if (!Number.isInteger(marks))
        return res.status(400).send({
          status: false,
          message: "Marks should be an Integer",
        });
      if (!mongoose.Types.ObjectId.isValid(userId))
        return res
          .status(400)
          .send({ status: false, message: "Please provide a valid userId" });
      let existedSheet = await marksModel.findOne({
        $and: [{ name }, { subject },{userId}],
      });
      if (existedSheet) {
        let studentId = existedSheet._id;
        let updateMarks = await marksModel.findByIdAndUpdate(
          { _id: studentId },
          { $inc: { marks: marks } },
          { new: true }
        );
        return res.status(200).send({
          status: true,
          message: "Marks updated successfully",
          data: updateMarks,
        });
      } else {
        let marksheet = await marksModel.create(data);
        return res.status(201).send({
          status: true,
          message: "Marksheet created succesfully",
          data: marksheet,
        });
      }
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  getMarks: async (req, res) => {
    try {
      let data = req.query;
      let { subject, name } = data;
      let filter = {isDeleted:false};
      if (subject) {
        let sub = ["Maths", "English", "Science"];
        if (!sub.includes(subject))
          return res.status(400).send({
            status: false,
            message: "Please provide available subjects",
          });
        filter.subject = subject;
      }
      if (name) {
        if (!objectValue(name))
          return res.status(400).send({
            status: false,
            message: "Please enter a valid student name",
          });
        filter.name = name;
      }
      let getDetails = await marksModel.find(filter);
      if (getDetails.length == 0)
        return res
          .status(400)
          .send({ status: false, message: "Student not found" });
      return res
        .status(200)
        .send({ status: true, message: "Student details", data: getDetails });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  // addMarks: async (req, res) => {
  //   try {
  //     let data = req.body;
  //     let { name, marks } = data;
  //     if (!objectValue(name))
  //       return res.status(400).send({
  //         status: false,
  //         message: "Please enter a valid student name",
  //       });
  //     if (!Number.isInteger(marks))
  //       return res
  //         .status(400)
  //         .send({ status: false, message: "Marks should be in integer" });
  //     let student = await marksModel.findOne({ name });
  //     if (!student)
  //       return res
  //         .status(400)
  //         .send({ status: false, message: "Student not found" });
  //     let studentId = student._id;
  //     let updateMarks = await marksModel.findByIdAndUpdate(
  //       { _id: studentId },
  //       { $inc: { marks: marks } },
  //       { new: true }
  //     );
  //     return res.status(200).send({
  //       status: true,
  //       message: "Marks updated successfully",
  //       data: updateMarks,
  //     });
  //   } catch (err) {
  //     return res.status(500).send({ status: false, message: err.message });
  //   }
  // },

  editDetails: async (req, res) => {
    let data = req.body;
    let studentId = req.params.studentId;
    let { name, marks, subject } = data;

    if (name && !objectValue(name))
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid student name" });
    if (subject) {
      let sub = ["Maths", "English", "Science"];
      if (!sub.includes(subject))
        return res.status(400).send({
          status: false,
          message: "Please provide available subjects",
        });
    }
    if (marks && !Number.isInteger(marks))
      return res
        .status(400)
        .send({ status: false, message: "Marks should be in integer" });
    let updateThings = {};
    if (name) {
      updateThings.name = name;
    }

    let editMarksheet = await marksModel.findOneAndUpdate(
      { _id: studentId },
      { $set: data },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      message: "Things edited successfully",
      data: editMarksheet,
    });
  },

  deleteStudent: async (req, res) => {
    let studentId = req.params.studentId;
    if (!mongoose.Types.ObjectId.isValid(studentId))
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid student Id" });
    let studentDeletion = await marksModel.findByIdAndUpdate(
      { _id: studentId },
      { $set: { isDeleted: true,deletedAt:Date.now() } },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "Marksheet deleted Successfully!",
        data: studentDeletion,
      });
  },
};
