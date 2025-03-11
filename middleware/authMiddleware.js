const jwt = require("jsonwebtoken");
const User = require("../model/user");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: "Invalid Token" });
        }

        const user = await User.findOne({ _id: decoded.id });
        if (!user) {
            return res.status(403).json({ message: "User Not Found. Authentication failed" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in authentication: ", error.message);
        res.status(400).json({ message: "Invalid Token" });
    }
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied. Admins only" });
    }
    next();
}

module.exports = { authenticate, isAdmin };