import mongoose  from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


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

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")){
        return next()
    }
    try {
        const salt= await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password ,salt)
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.generateAuthToken = function (){
    return jwt.sign({id : this._id , role : this.role}, process.env.JWT_SECRET  , { expiresIn: process.env.JWT_EXPIRES_IN})
}
userSchema.methods.comparePassword =async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword , this.password)
}

export default mongoose.model("User" , userSchema)