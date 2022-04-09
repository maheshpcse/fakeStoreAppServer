//initializes
// require('./task.js');
const mongoose = require('mongoose');
require('./model/user');
require('./model/product');
require('./model/cart');
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

//app
const app = express();

//port
const port = process.env.PORT || 6400;

//routes
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

//middleware
app.use(cors());

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());

//view engine
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.use('/products', productRoute);
app.use('/carts', cartRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);

// MongoDB connection options
const options = {
	user: process.env.DB_USERNAME,
	pass: process.env.DB_PASSWORD,
	auth: {
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		authdb: 'fake_store'
	},
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// useCreateIndex: true
}

//mongoose
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose
	.connect(process.env.DATABASE_URL, options)
	.then(() => {
		app.listen(port, () => {
			console.log('connect');
		});
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = app;