const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req, res, next) => {
	const secret = 'IWonderWhyITearMyselfDown';

	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, secret);
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

		if (!user) {
			throw new Error();
		}

		res.token = token;
		req.user = user;
		next();
	}
	catch (error) {
		res.status(401).send({ error: "Please  authenticate." });
	}
}

module.exports = auth;