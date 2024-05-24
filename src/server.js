
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

const corsConfig = {
    origin: true,
    credentials: true,
    allowHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
        "Authorization",
        "Access-Control-allow-Origin",
        "access-control-allow-Origin",
    ]
}

dotenv.config();
mongoose.connect(process.env.DB_STRING)
.then(() => {
    console.log("Database connected successfully!");
})
.catch((error) => {
    console.log("Error connecting to Database!", error.message);
})

app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(session({secret: "Mousequiz", resave: true, saveUninitialized: false}));

const {createQuestion, getOneTopicQuestions, getAllTopicQuestions, updateQuestion, deleteQuestion} = require("./controllers/question.controller");
const { signUp, login } = require("./controllers/user.controller");
const userAuth = require("./middleware/user.middleware");

app.post("/api/questions", createQuestion);
app.get("/api/questions", getAllTopicQuestions);
app.get("/api/questions/:topic", getOneTopicQuestions);
app.put("/api/questions/:id", updateQuestion);
app.delete("/api/questions/:id", deleteQuestion);

app.post("/signup", signUp);
app.post("/login", login);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});
