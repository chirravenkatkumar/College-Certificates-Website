const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/records")
.then(()=>{
    console.log("Mongodb Connected to student");
}).catch(()=>{
    console.log("Failed");
})


const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required : true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})


const collection_student = new mongoose.model("collection_student",LoginSchema)
c

module.exports = collection