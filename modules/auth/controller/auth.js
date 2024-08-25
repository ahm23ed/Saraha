import { userModel } from "../../../DB/model/user.model.js"
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../../services/sendEmail.js"
import { asyncHandler } from "../../../services/errorHandling.js"
import { generateNumericCode } from "../../../services/generateNumericCode.js"

import {
	StatusCodes,
	getReasonPhrase
} from 'http-status-codes';

export const signUp = asyncHandler(async (req, res) => {
    try {
        const { email, phone, password, firstName, userName } = req.body
        const user = await userModel.findOne({ email }).select("email")
        if (user) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const existingUserName = await userModel.findOne({ userName }).select('userName')
        if (existingUserName) {
            return res.status(400).json({ message: "Username already exists. Please choose another." });
        }
        const hashPassword = await bcrypt.hash(
            password,
            parseInt(process.env.saltRound)
        )
        const sharableURL = `${req.protocol}://${req.headers.host}/api/v1/message/send/${userName}`;
        const newUser = new userModel({
            email,
            phone,
            password: hashPassword,
            firstName,
            userName,
        });
        const savedUser = await newUser.save();
        const token = jwt.sign(
            { id: savedUser._id },
            process.env.confirmEmailToken,
        )
        const rfToken = jwt.sign(
            { id: savedUser._id },
            process.env.confirmEmailToken
        )
        const emailMessage = `<a href='${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/confirmEmail/${token}'> Follow me to confirm your account</a><br><a href='${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/requestRfToken/${rfToken}'> Request new link</a>`;
        sendEmail(savedUser.email, "Confirm Email", emailMessage);
        return res.status(201).json({ message: "Registration successful", sharableURL, token });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
})


export const confirmEmail = asyncHandler( async (req, res) => {
        try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.confirmEmailToken);
        const user = await userModel.updateOne(
            { _id: decoded.id, confirmEmail: false },
            { confirmEmail: true }
        );
        user.modifiedCount
            ? res.status(201).json({ message: "Email confirmed plz login " })
            : res.status(400).json({
                message: "eathir email already confirmed or in-valid email ",
            });
        } catch (error) {
        res.status(500).json({ message: "catch error", error });
        }
    });
    
    
    
    export const requestRefToken = asyncHandler( async (req, res) => {
        try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.confirmEmailToken);
        if (!decoded?.id) {
            res.status(400).json({ message: "In-valid token payload" });
        } else {
            const user = await userModel.findById(decoded.id);
            if (user?.confirmEmail) {
            res.json({ message: "Already confirmed" });
            } else {
            const token = jwt.sign(
                { id: user._id },
                process.env.confirmEmailToken,
                {
                expiresIn: 60 *60*60*60* 2,
                }
            );
            const emailMessage = `<a href='${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/confirmEmail/${token}'>Follow me to confrim Your account</a>`;
            sendEmail(user.email, "Confirm-Email", emailMessage);
            res.status(201).json({ message: "Done" });
            }
        }
        } catch (error) {
        res.status(500).json({ message: "Catch error", error });
        }
    });
    
    export const signIn = asyncHandler(async (req, res) => {
        try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
    
        if (!user) {
            res.status(400).json({ message: "Invalid account" });
        } else {
            if (!user.confirmEmail) {
            res.status(400).json({ message: "Please confirm your email first" });
            } else {
            const match = await bcrypt.compare(password, user.password);
    
            if (!match) {
                res.status(400).json({ message: "Invalid password" });
            } else {
                const token = jwt.sign(
                { id: user._id, isLoggedIn: true },
                process.env.TOKENSIGNATURE,
                { expiresIn: '24h' }
                );
                console.log(token);
                await userModel.updateOne({ _id: user._id }, { online: true });
                res.status(StatusCodes.OK).json({
                message: `loggedIn as ${user.role}`,
                token,
                role: user.role,
                username: user.userName,
                statusCode: getReasonPhrase(StatusCodes.OK),
                });
            }
            }
        }
        } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Catch error", error });
        }
    });
    
    export const sendCode = asyncHandler(async (req, res) => {
        const user = req.user; 
        if (user.isDeleted || user.blocked) {
        return res.status(400).json({
            message: "Can't send code to a non-registered or blocked account",
        });
        }
        const code = generateNumericCode(6);
        await userModel.updateOne(
        await userModel.updateOne(
            { _id: user._id },
            { code}
        )
        );
        console.log('Sending email to:', user.email);
        if (user.email) {
        sendEmail(
            user.email,
            "Forgot Password",
            `<h1>Dear ${user.userName}, please use this code: ${code} to reset your password</h1>`
        );
        } else {
        return res.status(400).json({ message: "User email is not defined" });
        }
        
        res.status(201).json({ message: "Code sent successfully" });
    });
    
    
    
    export const forgetPassword = asyncHandler( async (req, res) => {
        const { email, code, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
        res.json({ message: "Not register account" });
        } else {
        if (user.code != code || code == null) {
            res.status(400).json({ message: "In-valid Code" });
        } else {
            const hashPassword = await bcrypt.hash(
            password,
            parseInt(process.env.SaltRound)
            );
            await userModel.updateOne(
            { _id: user._id },
            { password: hashPassword, code: null }
            );
            res.status(201).json({ message: "Done" });
        }
        }
    });
    
    
    
    export const logOut = asyncHandler(async (req, res) => {
        const user = await userModel.findOneAndUpdate(
        { _id: req.user._id, online: true }, 
        { online: false, lastSeen: new Date() }, 
        { new: true }
        ).select("firstName lastName email lastSeen age");
        if (user) {
        res.status(201).json({ message: "Done", user });
        } else {
        res.status(400).json({ message: "Invalid user token or this token expired" });
        }
    });
    
    