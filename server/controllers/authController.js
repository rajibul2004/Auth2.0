import bcrypt from 'bcryptjs'
import UserModel from '../models/userModel.js';
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from '../config/nodemailer.js';
dotenv.config()

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({
            success: false,
            message: "Missing details"
        });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User already exists"
            });
        }

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email.trim(),
            subject: "Welcome to Auth",
            text: `Welcome to auth. Your account has been created with email id: ${email}`
        }
        try {
            await transporter.sendMail(mailOption);
        }
        catch (mailErr) {
            console.error("Email send error:", mailErr);
            return res.status(500).json({
                success: false,
                message: "Registration successful, but failed to send email."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name: name.trim(), email: email.trim(), password: hashedPassword });
        await newUser.save();

        const token = jsonwebtoken.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "User registered",
            name: name.trim(),
            email: email.trim()
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email and Password required!"
        })
    }
    try {
        const existingUser = await UserModel.findOne({ email })
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid user"
            })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }
        const token = jsonwebtoken.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            name: existingUser.name.trim(),
            email: existingUser.email.trim()
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            message: "Logged out"
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Account already varified"
            })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}.\n Verify your account with this otp`
        }
        await transporter.sendMail(mailOption)

        user.verifyOtp = otp;
        user.verifyOtpExpAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save()

        res.status(200).json({
            success: true,
            message: "Verification OTP Sent on Email"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const verifyEamil = async (req, res) => {

    const userId = req.userId || req.body.userId;
    const { otp } = req.body

    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: "Missing details!"
        })
    }

    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not available!"
            })
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            res.status(403).json({
                success: false,
                message: "OTP is invalid!"
            })
        }
        if (user.verifyOtpExpAt < Date.now()) {
            res.json.status(403).json({
                success: false,
                message: "OTP Expired"
            })
        }
        user.isVerified = true;
        user.verifyOtp = ''
        user.verifyOtpExpAt = 0
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email varified successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const sendResetOtp = async (req, res) => {
    const { email } = req.body
    if (!email.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        })
    }
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found!"
            })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Passwor Reset OTP",
            text: `Your OTP is ${otp}.\n Reset your password with this otp`
        }
        await transporter.sendMail(mailOption)

        user.resetOtp = otp;
        user.resetOtpExpAt = Date.now() + 15 * 60 * 1000
        await user.save()

        return res.status(200).json({
            success: true,
            message: "OTP sent to email"
        })

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if (!email.trim() || !otp || !newPassword.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email, OTP and new Password are required"
        })
    }
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found!"
            })
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        if (user.resetOtpExpAt < Date.now()) {
            return res.status(403).json({
                success: false,
                message: "OTP expired!"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;
        user.resetOtp = ''
        user.resetOtpExpAt = 0

        await user.save()

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getUserData = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId

        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }
        res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                profilePic: user.profilePic,
            }
        })

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const googleAuth = async (req, res) => {
    try {
        const { appToken } = req.body;
        if (!appToken) {
            return res.status(400).json({ error: "Token missing" });
        }
        const googleRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${appToken}`
        );

        const googleUser = await googleRes.json();

        if (googleUser.error_description) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Google token'
            });
        }
        const user = await UserModel.findOne({ email: googleUser.email });
        let isNew = false;
        if (user && user.password === "google_auth") {
            const token = jsonwebtoken.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }
        if(user &&user.password!=="google_auth"){
            return res.status(401).json({
                success:false,
                message:"User already exist"
            })
        }
        if (user === null) {
            const newUser = new UserModel({
                name: googleUser.name || 'Unnamed User',
                email: googleUser.email,
                password: 'google_auth',
                provider: "google",
                isVerified: googleUser.email_verified,
                profilePic: googleUser.picture,
            });
            await newUser.save()
            isNew = true;
            const mailOption = {
                from: process.env.SENDER_EMAIL,
                to: googleUser.email,
                subject: "Welcome to Auth",
                text: `Welcome to auth. Your account has been created with email id: ${googleUser.email}`
            }
            try {
                await transporter.sendMail(mailOption);
            }
            catch (mailErr) {
                console.error("Email send error:", mailErr);
                return res.status(500).json({
                    success: false,
                    message: "Registration successful, but failed to send email."
                });
            }
            const token = jsonwebtoken.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }
        res.json({
            success: true,
            message: isNew
                ? 'Google sign up successful'
                : 'Google login successful',
            user,
        });
    }
    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

const facebookAuth = async (req, res) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({
                success: false,
                message: 'Access token missing',
            });
        }
        const fbRes = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
        );


        const fbUser = await fbRes.json();

        if (fbUser.error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Facebook token',
            });
        }

        const user = await UserModel.findOne({ email: fbUser.email });
        let isNew = false;
        if (user && user.password === "facebook_oauth") {
            const token = jsonwebtoken.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }
        if(user &&user.password!=="facebook_auth"){
            return res.status(401).json({
                success:false,
                message:"User already exist"
            })
        }
        if (user === null) {
            const newUser = new UserModel({
                name: fbUser.name || 'Unnamed User',
                email: fbUser.email,
                password: 'facebook_oauth',
                provider: "facebook",
                profilePic: fbUser.picture.data.url,
                isVerified: true,
            });
            await newUser.save()
            isNew = true;
            const mailOption = {
                from: process.env.SENDER_EMAIL,
                to: fbUser.email,
                subject: "Welcome to Auth",
                text: `Welcome to auth. Your account has been created with email id: ${fbUser.email}`
            }
            try {
                await transporter.sendMail(mailOption);
            }
            catch (mailErr) {
                console.error("Email send error:", mailErr);
                return res.status(500).json({
                    success: false,
                    message: "Registration successful, but failed to send email."
                });
            }
            const token = jsonwebtoken.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }
        res.json({
            success: true,
            message: isNew
                ? 'Google sign up successful'
                : 'Google login successful',
            user,
        });
    }
    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

export { register, login, logout, verifyOtp, verifyEamil, isAuthenticated, sendResetOtp, resetPassword, getUserData, googleAuth, facebookAuth }