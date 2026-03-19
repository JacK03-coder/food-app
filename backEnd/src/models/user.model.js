const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{type:String , required:true},
    email: {type:String, required:true  , unique:true},
    password: {type:String},
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    favoriteCuisine: { type: String, default: "" }
},
{
    timestamps: true
}
);
const userModel = mongoose.model('user' , userSchema);

        
module.exports = userModel;
