const express = require("express");
const { createTask, getUserTasks, getAllTask, getAllTask2, updateTask, deleteTask } = require("../controller/task_controller");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const { validatetask } = require("../middleware/validations");
const router = express.Router();

router.post("/createtask", authenticate, isAdmin, validatetask, createTask);
router.get("/getUserTasks", authenticate, getUserTasks);
router.get("/getAllTasks", authenticate, isAdmin, getAllTask);
router.put("/updateTask/:id", authenticate, isAdmin, updateTask);
router.delete("/deleteTask/:id", authenticate, isAdmin, deleteTask);

module.exports = router;