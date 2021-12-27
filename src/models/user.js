const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Create a new Schema for user model
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		default: "Anonymous",
		trim: true,
	},
	password: {
		type: String,
		required: true,
		minLength: 7,
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error('Password must not contain "password"');
			}

			return true;
		},
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid');
			}

			return true;
		},
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new Error('Age must be positive number');
			}

			return true;
		},
	},
	tokens: [{
		token: {
			type: String,
			required: true,
		},
	}],
})

// Sending only public data
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
}

// Generate a JWT token
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const secret = 'IWonderWhyITearMyselfDown';

	const token = jwt.sign({ _id: user._id.toString() }, secret, { expiresIn: '7 days' });

	// Store the token to document
	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
}

// Verify the credentials when logging in
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });		// check the email

	if (!user) {
		throw new Error('Unable to login');
	}

	const isMatch = await bcrypt.compare(password, user.password);		// check the password

	if (!isMatch) {
		throw new Error('Unable to login');
	}

	return user;
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();		// call to stop running middleware and save user!
})

// Create a User model
const User = mongoose.model('User', userSchema)

module.exports = User;