import mongoose  from "mongoose";


const userSchema = new mongoose.Schema({

    nom : {
        type : String,
        required : true, 
        trim : true 
    }, 
    email : {
        type : String, 
        required : true, 
        unique : true , 
        trim : true,
    }, 
    password : {
        type : String , 
        required :true,
    },
    role : {
        type : String , 
        enum: ['APPRENANT', 'ADMIN', 'FORMATEUR'],
        default :  "APPRENANT"
    }, 
    isActive : {
        type : Boolean, 
        default : true,
    },


} , {timestamps : true})


export default mongoose.model("User" , userSchema)