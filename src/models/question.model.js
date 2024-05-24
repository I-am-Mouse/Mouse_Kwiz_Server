const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    topic: {type: "String", required: true},
    question: {type: "String", required: true, minLength: 5},
    options: [String],
    rightOption: {type: "String"}
}, {timestamps: true})

const QuestionModel = mongoose.model("Question", QuestionSchema);
module.exports = QuestionModel;