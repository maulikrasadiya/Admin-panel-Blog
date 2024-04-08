const mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({

    title:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    file:{
        type : String,
        required : true
    },
    userId:{
        type: String
    }
})


const blogModel = mongoose.model('Blogs',blogSchema);

module.exports = blogModel;