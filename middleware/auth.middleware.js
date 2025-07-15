import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const authenticateToken = async (req, res, next) => {
  try {
    
    const authHeader = req.headers["authorization"];

   
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ msg: "Token invalide ou manquant" });
    }

 
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "Utilisateur non trouvé" });
    }

    if (!user.isActive) {
      return res.status(401).json({ msg: "Votre compte est suspendu" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token invalide" });
  }
};


