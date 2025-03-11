const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../model/user");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const emailExist = await user.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user1 = new user({ name, email, password: hashedPassword, role });
        await user1.save();

        res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
        console.log("error in register user");
        res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await user.findOne({ email });
        if (!userExist) return res.status(400).json({ message: "Invalid email and password" });

        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email and password" });

        const token = jwt.sign({ id: userExist._id, role: userExist.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: userExist.role });
    } catch (error) {
        console.log("error in login user");
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login }