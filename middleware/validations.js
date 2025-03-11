const Joi = require("joi");

const taskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).required(),
    assignedTo: Joi.string().required(),
    status: Joi.string().valid("pending", "in-progress", "completed").default('pending')
})

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "validation Error", errors: error.details.map(err => err.message) })
    }
    next();
}

module.exports = {
    validatetask: validate(taskSchema)
}