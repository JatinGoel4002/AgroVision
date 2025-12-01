const router = express.Router();
import express from "express";
import { signUp, login, getAllUsers } from "../controller/userController.js";
import { verifyToken } from "../config/isAuth.js";
router.get('/allusers', verifyToken, getAllUsers);
router.post('/signup', signUp);
router.post('/login', login);

export default router;
