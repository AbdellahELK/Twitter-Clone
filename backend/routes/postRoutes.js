import express from "express";
import protectedRoute from "../middlewear/protectedRoute.js";
import { createPost, deletePost, likeUnlikePost, commentOnPost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from "../controllers/postController.js";


const router = express.Router()

router.get("/all", protectedRoute, getAllPosts);
router.get("/likes/:id", protectedRoute, getLikedPosts);
router.get("/user/:username", protectedRoute, getUserPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete("/:id", protectedRoute, deletePost);

export default router