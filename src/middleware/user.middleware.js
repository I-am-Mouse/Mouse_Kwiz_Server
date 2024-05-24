const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({message: "Access denied, You need to be logged in."})
    }

    try {
        const userData = jwt.verify(token, process.env.SECRET_KEY);

        if (!userData || !userData.id) {
            return res.status(401).json({message: "Access denied, You need to be logged in."})
        }
    
        User.findById(userData.id)
        .then((user) => {
            if (!user) {
                return res.status(401).json({message: "Access denied, User account not found."})
            }
            req.session.userId = userData.id;
            next()
        })
        .catch((error) => {
            return res.status(401).json({message: "Server error, Please retry."})
    
        })
        
    } catch (err) {
        return res.status(401).json({message: "Access denied, Invalid Token."})
    }
}

module.exports = userAuth;