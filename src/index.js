const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
require('./db/mongoose.js')		// To run a connection

const app = express();
const port = process.env.PORT || 3000;

// Setup middleware for maintenance mode
// app.use((req, res, next) => {
// 	res.sendStatus(503);
// })

// Setup the application
app.use(express.json());		// convert incoming json to an object
app.use(userRouter);            // register a 'user' router
app.use(taskRouter);            // register a 'task' router

// Listen for connection
app.listen(port, () => {
	console.log(`App listening at port ${port}`);
})