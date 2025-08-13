import mongoose from "mongoose";
const { Schema } = mongoose;

const TeamDetailSchema = new Schema({
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isLeader: { type: Boolean, default: false, }
}, { timestamps: true });

export default mongoose.model('TeamDetail', TeamDetailSchema);