require('../src/db/mongoose.js')	// To run a connection
const User = require('../src/models/user.js')

// User.findByIdAndUpdate('60f7ff22a7234236d8978c1a', { age: 19 })
// 	.then(user => {
// 		console.log(user);
// 		return User.countDocuments({ age: 19 });	// Promise chaining
// 	})
// 	.then(numOfUsers => {
// 		console.log("The number of user: ", numOfUsers);
// 	})
// 	.catch(error => console.log(error))

const updateAgeAndCount = async (id, age) => {
	await User.findByIdAndUpdate(id, { age });
	const count = await User.countDocuments({ age });
	return count;
}

updateAgeAndCount('60f7ff22a7234236d8978c1a', 19)
	.then(count => {
		console.log(count);
	})
	.catch(error => console.log("error: ", error))