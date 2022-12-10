const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const marksSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    subject: {
      type: String,
      enum: ["Maths", "English", "Science"],
      require: true,
    },
    userId: {
      type: objectId,
      ref: "user",
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
    deletedAt:{
      type:Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("marks", marksSchema);
