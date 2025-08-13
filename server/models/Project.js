import mongoose from "mongoose";
const { Schema } = mongoose;

const ProjectSchema = new Schema({
    projectName: { type: String, required: true },
    projectStartDate: { type: Date },
    projectEndDate: { type: Date },
    description: { type: String },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema)