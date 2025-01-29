import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import { v2 as cloudinary } from 'cloudinary';


export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!text && !img) {
            return res.status(404).json({ error: error.message });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ user: userId, text: text, img: img });
        await newPost.save();

        res.status(200).json({ message: "Post created succcessfully", newPost });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "You are not authorized to delete this post" });
        }
        if (post.img) {
            imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        const postToDel = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully", postToDel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the authenticated user
        const { id: postId } = req.params; // Get the post ID from the request parameters
        const { comment } = req.body; // Extract the comment text from the request body

        // Check if the comment is provided and is a non-empty string
        if (!comment || typeof comment !== 'string' || comment.trim() === "") {
            return res.status(400).json({ error: "Comment cannot be empty!" });
        }

        const post = await Post.findById(postId); // Find the post by ID

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ error: "Post not found!" });
        }

        // Create a new comment object
        const newComment = {
            user: userId, // The ID of the user commenting
            text: comment, // The comment text
            createdAt: new Date() // Timestamp for the comment
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);
        await post.save(); // Save the updated post

        return res.status(201).json({ message: "Comment added!", comment: newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        let post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike post
            post = await Post.findByIdAndUpdate(
                postId,
                { $pull: { likes: userId } },
                { new: true }
            );

            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
        } else {
            // Like post
            post = await Post.findByIdAndUpdate(
                postId,
                { $addToSet: { likes: userId } }, 
                { new: true }
            );

            await User.updateOne({ _id: userId }, { $addToSet: { likedPosts: postId } });

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await notification.save();
        }

        res.status(200).json(post.likes); 
    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 }).populate("user").select("-password")
            .populate({
                path: "comments.user",
                select: "-password"
            })
        if (posts.length === 0) {
            res.status(404).json({ success: false, message: "No posts found" });
        }
        res.status(200).json({ success: true, posts })

    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.user._id

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "user not found" });
        }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });
        res.status(200).json(likedPosts);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "user not found" });
        };
        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ success: false, message: "user not found" });
        };

        const UserPosts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(UserPosts);


    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}