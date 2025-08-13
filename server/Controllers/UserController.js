import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import createToken from '../utils/createToken.js';
import { userRegister } from "../utils/Notification.js"

const createUser = async (req, res) => {
    let { name, email, password, designation, image } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, email, password: hashedPassword, designation, image
        });
        const savedUser = await newUser.save();
        if (savedUser) {
            userRegister(name, email, password)
        }
        const savedUserObj = savedUser.toObject();
        delete savedUserObj.password;

        return res.status(201).json({
            message: 'User created successfully',
            user: savedUserObj
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error. U-0 ' });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please Fill all the inputs field" })
    }
    try {
        const userExist = await User.findOne({ email })
        if (userExist) {
            const ispasswordMatch = await bcrypt.compare(password, userExist.password)
            if (ispasswordMatch) {
                createToken(res, userExist._id)
                return res.status(200).json({
                    _id: userExist._id,
                    name: userExist.name,
                    email: userExist.email,
                    designation: userExist.designation,
                    isAdmin: userExist.isAdmin,
                    active: userExist.active,
                })
            } else {
                return res.status(401).json({ message: "Invalid Email or Password" })
            }
        } else {
            return res.status(404).json("User not found.Please Register first.")
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error. U-2' });
    }

}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('PMS')
        res.status(200).json({ message: "User logged out successfully" })
        return
    } catch (error) {
        console.log("Error in logoutUser:", error);
        return res.status(500).json({ message: 'Internal Server error. U-5' });
    }
}

const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { name, email, designation, image, active } = req.body;

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (designation) user.designation = designation;
        if (image) user.image = image;
        if (typeof active === 'boolean') user.active = active;

        const updatedUser = await user.save();
        const updatedUserObj = updatedUser.toObject();
        delete updatedUserObj.password;

        return res.status(200).json({ message: 'User updated successfully', updatedUser: updatedUserObj });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error. U-1' });
    }
}

const deleteUserById = async (req, res) => {
    const { id } = req.params
    try {
        await User.findByIdAndDelete(id)
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error. U-3' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password -image -isAdmin");
        if (users.length === 0) {
            return res.status(200).json({ message: "No records found" });
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { createUser, updateUserById, loginUser, deleteUserById, getAllUsers, logoutUser };