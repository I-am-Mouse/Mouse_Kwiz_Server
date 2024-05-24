const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const signUp = (req, res) => {
    if (!req.body.fname || !req.body.lname || !req.body.email || !req.body.password) {
        return res.status(400).json({message: "Some required records are missing."})
    } else if (req.body.fname.length < 3 || req.body.lname.length < 3) {
        return res.status(400).json({message: "First and Lastname cannot be less than 3 characters"});
    };
    
    User.findOne({email: req.body.email})
    .then((user) => {
        if (user) {
            return res.status(401).json({message: "User with email already exists"});
        }

        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        const userData = {
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            password: hashPassword
        }

        User.create(userData)
        .then((user) => {
            res.status(201).json({message: "User account created successfully!", user});
        })
        .catch((error) => {
            res.status(500).json({message: "Technical error", error})
        })
    })
    .catch((error) => {
        res.status(500).json({message: "Technical error", error})
    })
}

const login = (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "Email and password are required."});
    }

    User.findOne({email})
    .then((user) => {
        if(!user) {
            return res.status(400).json({message: "User account not found."});
        }
        const passwordsMatch = bcrypt.compareSync(password, user.password);
        if (!passwordsMatch) {
            return res.status(400).json({message: "Email or password is incorrect."});
        }

        const userObj = {id: user._id};
        const token = jwt.sign(userObj, process.env.SECRET_KEY);
        res.status(200).json({message: "Logged in", token, user});
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({message: "Technical error", error});
    })
}

module.exports = {
    signUp,
    login
}