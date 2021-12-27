const express = require('express')
const Task = require('../models/task.js')

// Create a new router
const router = new express.Router();

/* Define the task routes */

// Create a new task
router.post('/tasks', async (req, res) => {
	try {
		const task = await Task.create(req.body);
		res.status(201).send(task);
	}
	catch (error) {
		res.status(400).send(error);
	}
})

// Fetch multiple tasks
router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.status(200).send(tasks);
	}
	catch (error) {
		res.sendStatus(500);
	}
})

// Fetch a single task
router.get('/tasks/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const task = await Task.findById(_id);

		if (!task) {
			return res.sendStatus(404);
		}

		res.status(200).send(task)
	}
	catch (error) {
		res.sendStatus(500);
	}
})

// Update a task
router.patch('/tasks/:id', async (req, res) => {
	const properties = Object.keys(req.body);
	const allowedProperties = ['description', 'completed'];
	const isValidOperation = properties.every(property => allowedProperties.includes(property));	// check for the valid property

	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid properties!" });
	}

	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return res.sendStatus(404);
		}

		properties.forEach(property => task[property] = req.body[property]);	// update the new value manually
		await task.save();

		res.status(200).send(task);
	}
	catch (error) {
		res.status(400).send(error);
	}
})

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);

		if (!task) {
			return res.sendStatus(404);
		}

		res.status(200).send(task);
	}
	catch (error) {
		res.sendStatus(500);
	}
})

module.exports = router;