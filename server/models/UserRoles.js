import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserRoleSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
}, { timestamps: true });

UserRoleSchema.index({ userId: 1, roleId: 1 }, { unique: true }); // prevent duplicates

export default mongoose.model('UserRole', UserRoleSchema);
// This schema defines the structure of the UserRole document in MongoDB.
// It includes fields for userId (reference to User) and roleId (reference to Role).