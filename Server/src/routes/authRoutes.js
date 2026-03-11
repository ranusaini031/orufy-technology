import express from "express";
import {
  signup,
  login,       

  getProfile,
} from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login); 
authRouter.get("/profile", verifyToken, getProfile);

export default authRouter;