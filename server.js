const express = require("express");
const connectdb = require("./config/db");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user_route");
const taskRoutes = require("./routes/task_route");
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json());
connectdb();

app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

console.log("hello");
