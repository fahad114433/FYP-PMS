import mongoose from "mongoose";
const { Schema } = mongoose;

const TeamSchema = new Schema({
    teamName: { type: String, required: true },
    active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Team', TeamSchema);
// This schema defines the structure of the Team document in MongoDB.
// It includes fields for teamName and active status.