import mongoose from "mongoose";
// Define the application schema
const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required: true,
        trim: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted','interview','selected'],
        default: 'pending',
    },
}, { timestamps: true });

// Create the application model
const Application = mongoose.model('Application', applicationSchema);

export { Application };
