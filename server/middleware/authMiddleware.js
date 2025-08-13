import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.PMS;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

const isAdmin = async (req, res, next) => {
    const token = req.cookies.PMS;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isAdmin === true) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({ message: "Not authorized as admin" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export { isAuthenticated, isAdmin };
