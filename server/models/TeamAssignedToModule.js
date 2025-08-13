import mongoose from "mongoose";
const { Schema } = mongoose;

const TeamAssignedToModuleSchema = new Schema({
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'ProjectSection', required: true },
    active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('TeamAssignedToModule', TeamAssignedToModuleSchema);