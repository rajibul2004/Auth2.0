import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        }
    },
    provider: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local",
    },
    googleId: {
        type: String,
        default: null,
    },
    profilePic: {
        type: String,
        default: "",
    },
    verifyOtp: {
        type: String,
        default: '',
    },
    verifyOtpExpAt: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: '',
    },
    resetOtpExpAt: {
        type: Number,
        default: 0,
    },
});

const UserModel = model("User", UserSchema)
export default UserModel;