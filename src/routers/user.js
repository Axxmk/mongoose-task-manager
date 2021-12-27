const express = require('express')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')

// Create a new router
const router = new express.Router();

/* Define the user routes */

// Create a new user (sign up)
router.post('/users', async (req, res) => {
	try {
		const user = await User.create(req.body);
		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	}
	catch (error) {
		res.status(400).send(error);
	}
})

// user login
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();

		res.status(200).send({ user, token });
	}
	catch (error) {
		res.status(400).send(error.message);
	}
})

// user logout (one device)
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
		await req.user.save();

		res.sendStatus(200);
	}
	catch (error) {
		res.sendStatus(500);
	}
})

// user logout (all devices)
router.post('/user/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();

		res.sendStatus(200);
	}
	catch (error) {
		res.sendStatus(500);
	}
})

// Fetch a user profile
router.get('/users/me', auth, async (req, res) => {
	res.status(200).send(req.user);
})

// Fetch a single user
router.get('/users/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const user = await User.findById(_id);

		if (!user) {
			return res.sendStatus(404);
		}

		res.status(200).send(user);
	}
	catch (error) {
		res.sendStatus(500);
	}
})

// Update a user
router.patch('/users/:id', async (req, res) => {
	const properties = Object.keys(req.body);
	const allowedProperties = ['name', 'email', 'password', 'age'];
	const isValidOperation = properties.every(property => allowedProperties.includes(property));	// check for the valid property

	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid properties!" });
	}

	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.sendStatus(404);
		}

		properties.forEach(property => user[property] = req.body[property]);	// update the new value manually
		await user.save();

		res.status(200).send(user);
	}
	catch (error) {
		res.status(400).send(error);
	}
})

// Delete a user
router.delete('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return res.sendStatus(404);
		}

		res.status(200).send(user);
	}
	catch (error) {
		res.sendStatus(500);
	}
})

module.exports = router;