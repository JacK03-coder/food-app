const mongoose = require('mongoose');


function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("mongoDB is connected");
    })
    .catch((error)=>{
        console.log("error  occured while connecting with mongoDB...", error);
    })
};


module.exports = connectDB;             