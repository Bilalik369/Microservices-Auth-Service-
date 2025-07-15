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



export const login = async(req ,res)=>{
    try {
        const {email , password} =req.body;
        if(!email || !password){
            return res.status(400).json({msg : "tout les champs est obligatoirer"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({msg : "Email ou mot de passe incorrect"})
        }
        const isPasswordValide = await user.comparePassword(password)
        if(!isPasswordValide){
            return res.status(401).json({msg : "password in valide"})
        } 
        if(!user.isActive){
            return res.status(401).json({msg : "Compte désactivé"})
        }

        const token = user.generateAuthToken()


        res.status(201).json({
            success : true, 
            message : "login success",
            token,
            user : {
                id : user._id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({msg : "Erreur serveur lors de la connexion"})
    }
}

export const getProfile = async(req , res)=>{
    try {
        res.status(201).json({
            success : true,
            user : req.user,
        })
    } catch (error) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
}