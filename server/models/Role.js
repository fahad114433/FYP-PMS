import mongoose from "mongoose";
const { Schema } = mongoose;

const RoleSchema = new Schema({
    roleName: { type: String, required: true, enum: ['Team Leader', 'Team Member'] },
    active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Role', RoleSchema)