import express from "express";
import { GetUserProfile, followUnfollowUser, getSuggestedUsers, updateUser } from '../controllers/userController.js';
import protectedRoute from "../middlewear/protectedRoute.js";

const router = express.Router();

router.get("/suggested", protectedRoute, getSuggestedUsers);
router.get("/:username", protectedRoute, GetUserProfile);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.post("/update", protectedRoute, updateUser);



export default router