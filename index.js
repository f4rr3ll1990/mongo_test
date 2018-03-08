var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var app = express();
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



////////////////////////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
	res.send('F4rr3LL Test API')
});

// Get All
app.get('/articles', (req, res) => {
	db.find().toArray((err, docs) => {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		}
		res.send(docs);
	});
});

// Get One
app.get('/articles/:id', (req, res) => {
	db.findOne({
		_id: ObjectId(req.params.id)
	}, (err, document) => {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		}
		res.send(document);
	});
});

// Add One
app.post('/articles', (req, res) => {
	var article = {
		name: req.body.name
	};
	db.insert(article, (err, result) => {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		}
		res.send(article);
	});
});

// Edit One
app.put('/articles/:id', (req, res) => {
	db.updateOne(
		{ _id: ObjectId(req.params.id) },
		{ $set: {name: req.body.name }},
		function(err, result) {
			if (err) {
				console.log(err);
				res.sendStatus(500);
			}
			res.sendStatus(200);
		}
	);
});

// Delete One
app.delete('/articles/:id', (req, res) => {
	db.deleteOne(
		{ _id: ObjectId(req.params.id) },
		function(err, result) {
			if (err) {
				console.log(err);
				res.sendStatus(500);
			}
			res.sendStatus(200);
		}
	);
});



////////////////////////////////////////////////////////////////////////////////
// DB Connection
////////////////////////////////////////////////////////////////////////////////

uri = 'mongodb://f4rr3ll:110512@cluster0-shard-00-00-ienf3.mongodb.net:27017,cluster0-shard-00-01-ienf3.mongodb.net:27017,cluster0-shard-00-02-ienf3.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
MongoClient.connect(uri, (err, client) => {
	if (err) {
		return console.log(err)
	}
	db = client.db("posts").collection("posts");
	app.listen(3013, () => {
		console.log('API Started on 3013 port')
	});
});
