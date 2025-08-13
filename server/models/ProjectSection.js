import mongoose from "mongoose";
const { Schema } = mongoose;

const ProjectSectionSchema = new Schema({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    moduleName: { type: String, required: true },
    active: { type: Boolean, default: true },
    description: { type: String },
    teamLeader: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

export default mongoose.model('ProjectSection', ProjectSectionSchema)