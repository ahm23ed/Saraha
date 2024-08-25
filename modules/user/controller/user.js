import { userModel } from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
import { asyncHandler } from "../../../services/errorHandling.js"
import { myMulter, fileValidation, HME } from '../../../services/multer.js';
import cloudinary from '../../../services/cloudinary.js';
export const userProfile = async (req, res) => {
    const user = await userModel.findById(req.user._id)
    res.json({ message: "User module", user })
}

export const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await userModel.findById(req.user._id)
    const match = await bcrypt.compare(oldPassword, user.password)
    if (!match) {
        res.json({ message: "In-valid Password" })
    } else {
        const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound))
        await userModel.findOneAndUpdate({ _id: user._id }, { password: hashPassword });
        res.json({ message: "Done" })
    }
}
)

export const uploadProfilePic = [
    myMulter(fileValidation.image).single('profilePic'),
    HME,
    asyncHandler(async (req, res, next) => {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'GradApp/profile-pics'
        });
        if (user.profilePicPublicId) {
            await cloudinary.uploader.destroy(user.profilePicPublicId);
        }
        user.profilePic = result.secure_url;
        user.profilePicPublicId = result.public_id;
        await user.save();
        res.status(201).json({ message: 'Profile picture uploaded successfully',
            profilePic: result.secure_url });
    })
]

export const updateProfile = asyncHandler(async (req, res) => {
    try {
        const {  phone, firstName } = req.body;

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            });
        }
        user.phone = phone || user.phone;
        user.firstName = firstName || user.firstName;
        await user.save();
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                phone: user.phone,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Server error', error: error.message })
        console.log(error);
    }
});