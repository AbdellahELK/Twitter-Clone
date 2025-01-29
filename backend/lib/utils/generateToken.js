import jwt from "jsonwebtoken";

export const generateTokeAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: "15d",
    });
    // res.cookie("jwt", token, {
    //     httpOnly: true,
    //     maxAge: 15 * 24 * 60 * 60 * 1000,
    //     sameSite: "strict",
    //     secure: process.env.NODE_ENV !== "development"
    // })
    res.cookie('jwt', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Adjust based on your needs
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiry time (e.g., 1 day)
    });
}
