import { generateTokeAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
export const signUp = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        const existingUser = await User.findOne({ username })
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' })
        }
        if (existingUser) {
            return res.status(404).json({ message: "User already exist" })
        }
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(404).json({ message: "Email already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ username, email, fullName, password: hashedPassword })
        if (newUser) {
            generateTokeAndSetCookie(newUser._id, res)
            await newUser.save()
        }
        res.status(201).json({ message: 'User created successfully', newUser })


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid password" })
        }
        generateTokeAndSetCookie(user._id, res)
        res.status(200).json({ success: true, message: 'User logged in successfully', user })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        });
        res.status(200).json({ success: true, message: "User logout successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
export const GetProfil = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ success: true, message: "User profil", user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}