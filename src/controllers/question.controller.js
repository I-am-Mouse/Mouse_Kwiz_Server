const Question = require("../models/question.model");

const createQuestion = (req, res) => {
    if (!req.body.topic || !req.body.question || !req.body.options || !req.body.rightOption) {
        return res.status(400).json({message: "A required field is missing."});
    } else if (req.body.question.length < 5) {
        return res.status(400).json({message: "Question cannot be less than 5"});
    }

    // const questionId = req.params.id;
    const userId = req.session.userId;
    const questionData = {
        topic: req.body.topic,
        question: req.body.question,
        options: req.body.options,
        rightOption: req.body.rightOption,
        // user: userId
        // question: questionId
    }

    Question.create(questionData)
    .then((questions) => {
        res.status(201).json({message: "Question created successfully!", questionsId: questions._id});
    })
    .catch((error) => {
        res.status(500).json({message: "Error creating Question, retry", error});
    })
}

const getAllTopicQuestions = (req, res) => {
    Question.find({})
    .then((questions) => {
        res.status(200).json({message: "All Topics questions retrieved successfully!", questions});
    })
    .catch((error) => {
        res.status(500).json({message: "Technical error", error});
    })
}

const getOneTopicQuestions = (req, res) => {
    Question.find({topic: req.params.topic})
    .then((questions) => {
        if (!questions) {
            return res.status(404).json({message: "Topic not found"});
        }
        res.status(200).json({message: "Chosen topic questions retrieved successfully!", questions});
    })
    .catch((error) => {
        res.status(500).json({message: "Technical error", error});
    })
}
 
const updateQuestion = (req, res) => {
    const id = req.params.id;
    const questionData = {
        topic: req.body.topic,
        question: req.body.question,
        options: req.body.options,
        rightOption: req.body.rightOption
    }
    Question.findByIdAndUpdate(id, questionData)
    .then(() => {
        res.status(200).json({message: "Question updated successfully!", questionsId: id});
    })
    .catch((error) => {
        res.status(500).json({message: "Technical error", error});
    })
}

const deleteQuestion = (req, res) => {
    const id = req.params.id;
    Question.findByIdAndDelete(id)
    .then(() => {
        res.status(200).json({message: "Question deleted successfully!"});
    })
    .catch((error) => {
        res.status(500).json({message: "Technical error", error});
    })
}

module.exports = {
    createQuestion,
    getAllTopicQuestions,
    getOneTopicQuestions,
    updateQuestion,
    deleteQuestion
}