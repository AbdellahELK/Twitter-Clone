import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ msg: 'Unauthorized: No token provided!' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ msg: 'Unauthorized: Invalid token!' });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ msg: 'Unauthorized: User not found!' });
        }
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default protectedRoute