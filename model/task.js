const mongoose = require('mongoose');
const { compile } = require('morgan');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name : {
        type : String ,
        required : true
    },

    completed : {
        type : Boolean ,
        default : false
    }
}, {timestamps : true});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;