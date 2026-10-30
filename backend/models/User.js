import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "vendor"], default: "vendor" },
    status: {
        type: String,
        enum: ["pending", "approved", "suspended"],
        default: "pending",
    },
    studioName: { type: String, trim: true },
    studioSlug: { type: String, unique: true, sparse: true, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
}, { timestamps: true }, );

export default mongoose.model("User", userSchema);