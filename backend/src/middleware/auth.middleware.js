import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      // No token → no error, simplemente sigue sin establecer req.user
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(); // Token inválido → continúa sin usuario
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(); // Usuario no encontrado → continúa sin usuario
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    next(); // En caso de cualquier error, simplemente continúa
  }
};
