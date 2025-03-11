const task = require("../model/task");
const user = require("../model/user");

const createTask = async (req, res) => {
    try {
        const assignedToId = req.body.assignedTo;
        const isAdmin = await user.findOne({ _id: assignedToId, role: 'admin' });
        console.log("isadmin => ", isAdmin);
        if (isAdmin) {
            return res.status(400).json({ message: "Cannot assigned task to admin" });
        }
        const result = new task(req.body);
        const r = await result.save();
        console.log(r);
        res.status(201).json({ message: "Task created successfully", data: r });
    } catch (error) {
        console.log("error in create task : ", error.message);
        res.status(500).json({ message: error.message })
    }
}

const getUserTasks = async (req, res) => {
    try {
        const tasks = await task.find({ assignedTo: req.user._id }).populate('assignedTo');
        res.json(tasks);
    } catch (error) {
        console.log("Error in usertasks");
        res.status(500).json({ message: error.message });
    }
}

const getAllTask = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const searchFilter = search ? { $or: [{ title: new RegExp(search, "i") }, { description: new RegExp(search, "i") }] } : {};

        const totaltasks = await task.countDocuments(searchFilter);

        const tasks = await task.find(searchFilter)
            .populate("assignedTo", "-password -email -__v")
            .select("-__v")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            totaltasks,
            currentpage: page,
            totalpages: Math.ceil(totaltasks / limit),
            tasks
        })

    } catch (error) {
        console.log("Error in getalltask :", error.message);
        res.status(500).json({ message: error.message });
    }
}

const getAllTask2 = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        let skip = (page - 1) * limit;
        const searchCriteria = search ? {
            $or: [
                { title: new RegExp(search, "i") },
                { description: { $regex: search, $options: "i" } }]
        } : {};

        const pipeline = [
            { $match: searchCriteria },
            {
                $lookup: {
                    from: "users",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedTo"
                }
            },
            {
                $unwind: {
                    path: "$assignedTo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    status: 1,
                    createdAt: 1,
                    assignedTo: {
                        _id: 1,
                        name: 1,
                        role: 1
                    }
                }
            },
            { $sort: { createdAt: 1 } },
            { $skip: skip },
            { $limit: limit },
        ]

        const totaltasks = await task.countDocuments(searchCriteria);
        const tasks = await task.aggregate(pipeline);

        res.json({
            totaltasks,
            currentpage: page,
            totalpages: Math.ceil(totaltasks / limit),
            tasks
        });
    } catch (error) {
        console.log("error in getalltasks", error.message);
        res.status(500).json({ message: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        let taskId = req.params.id;
        let body = req.body;
        const updatedtask = await task.findByIdAndUpdate(taskId, body, { new: true });
        res.status(200).json({ message: "updated", data: updatedtask })
    } catch (error) {
        console.log("error in updatetask : ", error.message);
        res.status(500).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        let taskid = req.params.id;
        const deletedtask = await task.findByIdAndDelete(taskid);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log("error in deletedtask", error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createTask, getUserTasks, getAllTask, getAllTask2, updateTask, deleteTask };