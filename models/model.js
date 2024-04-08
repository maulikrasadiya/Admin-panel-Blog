const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({

    name:{
        type : String,
        required : true
    },
    email:{
        type : String,  
        required : true
    },
    pass:{
        type : String,
        required : true
    }
})


const userModel = mongoose.model('Users',userSchema);

module.exports = userModel;