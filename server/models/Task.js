import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskSchema = new Schema({
    name: { type: String, required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'ProjectSection', required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    isCompleted: { type: Boolean, required: true, default: false },
    active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema)