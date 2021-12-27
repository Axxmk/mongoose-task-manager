require('../src/db/mongoose.js')	// To run a connection
const Task = require('../src/models/task.js')

// Task.findByIdAndDelete('60f85e79d72e7e2ab4d93000')
// 	.then(task => {
// 		console.log("Deleted task: ", task);
// 		return Task.countDocuments({ completed: false });	// Promise chaining
// 	})
// 	.then(numOfTasks => {
// 		console.log("The number of incomplete task: ", numOfTasks);
// 	})
// 	.catch(error => console.log(error))

const deleteTaskAndCount = async (id) => {
	await Task.findByIdAndDelete(id);
	const count = await Task.countDocuments({ completed: false });
	return count;
}

deleteTaskAndCount('60f948c69909101440aea851')
	.then(count => {
		console.log("Incomplete tasks: ", count);
	})
	.catch(error => console.log("error: ", error))