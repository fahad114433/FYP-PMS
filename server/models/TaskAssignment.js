import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskAssignmentSchema = new Schema({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'ProjectSection', required: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    userAssignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDate: { type: Date, default: Date.now },
    taskStatus: { type: String, enum: ['Completed', 'Pending', 'InProgress'], default: 'Pending' },
    taskProgress: { type: Number, default: 0 },
    completionDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('TaskAssignment', TaskAssignmentSchema);