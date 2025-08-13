import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskProgressDetailSchema = new Schema({
    taskAssignedId: { type: Schema.Types.ObjectId, ref: 'TaskAssignment', required: true },
    date: { type: Date, default: Date.now },
    remarks: { type: String }
}, { timestamps: true });

export default mongoose.model('TaskProgressDetail', TaskProgressDetailSchema);
// This schema defines the structure of the TaskProgressDetail document in MongoDB.