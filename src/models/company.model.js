import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    logo: {
        type: String,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

export { Company };
