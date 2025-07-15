import User from "../models/User.model.js"


export const register = async(req , res)=>{
    try {
        const { nom  , email  , password , role}= req.body;
        if(!nom ||  !email || !password ||  !role){
            return res.status(400).json({msg : "toutes les chmap obligartoire"})
        }

        
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({msg : "user alrady existe"})
        }

        const newUser = new User({
            nom , 
            email , 
            password , 
            role : role || "APPRENANT"
        })

        await newUser.save()


        const token = newUser.generateAuthToken();
        res.status(201).json({
            success: true,
            message :  "Utilisateur créé avec succès",
            token ,
            user : {
                id : newUser._id,
                nom : newUser.nom,
                email : newUser.email,
                role : newUser.role,

            }

        })

    } catch (error) {
        res.status(500).json({msg : "error de linscription"})
    }
}