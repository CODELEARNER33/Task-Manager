const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Task = require('./model/task');
const { name } = require('ejs');
require('dotenv').config();  //Using dotevn for environment variables

//Express App
const app = express();

//MongoDB
const urlDB = 'mongodb+srv://rohittulse:to-do-list@cluster01.avvckka.mongodb.net/?retryWrites=true&w=majority&appName=cluster01';
mongoose.connect(urlDB)
    .then(() =>{
        console.log("connected to the MongoDB")
        app.listen(3000 , () =>{
            console.log('Server is running on http://localhost:3000')
        })
    })
    .catch((err) =>{
        console.error("There's problem with the connection to the database" , err);
    })

//Registry view Engine
app.set('view engine' , 'ejs');

//Middleware and Static Files
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.get('/', (req, res) => {
    res.redirect('/tasks');
});

app.get('/tasks' , (req, res) =>{

    Task.find()
        .then((result) =>{
            res.render('index', {title : "To-Do-List", tasks : result});
        })
        .catch((err) =>{
            console.log(err);
        })
});

app.post('/tasks' , (req, res) =>{
    const task = new Task(req.body);

    task.save()
        .then((result) =>{
            res.redirect('/tasks');
        })
        .catch((err) =>{
            console.log(err);
            res.status(500).send('Error saving task');
        })
});

app.post('/tasks/:id' , (req, res) =>{
    const id = req.params.id;

    Task.findByIdAndUpdate(id , {completed : req.body.completed === 'on'}, {new : true, runValidators : true})
        .then((result) =>{
            res.redirect('/tasks');
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send('Error updating task')
        })
});

app.put('/tasks/:id' , (req, res) =>{
    const id = req.params.id;

    const updateData = {name : req.body.name};

    Task.findByIdAndUpdate(id, updateData , {new : true , runValidators : true})
        .then((result) =>{
            res.json({success : true});
        })
        .catch((err) =>{
            console.log(err)
            res.json({success : false});
        })
});

app.delete('/tasks/:id' , (req, res) =>{
    const id = req.params.id ;

    Task.findByIdAndDelete(id)
        .then((result) =>{
            res.json({redirect : '/tasks'});
        })
        .catch((err) =>{
            console.log(err);
        });
});

app.use((req, res) =>{
    res.status(404).render('404', {title : "404 Error"});
});