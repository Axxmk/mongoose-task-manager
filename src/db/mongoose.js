const mongoose = require('mongoose')

// Define a connection URL
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

// Connect to server (database)
mongoose.connect(connectionURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
}).catch(error => console.log(error))