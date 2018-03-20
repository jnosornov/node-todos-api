var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// > method applied to create new todo
app.post('/todos', (req, res) => {
    // > create an instance of mongoose model
    var todo = new Todo({
        text: req.body.text
    });

    // > save the model to the database
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// > method applied to fetch todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});    
    }, (e) => {
        res.status(400).send(e);
    })
});

// > using urls parameters
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    // > validate Id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // > quering database
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};