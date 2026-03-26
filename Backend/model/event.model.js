import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    date: { 
        type: String, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    hostedBy: { 
        type: String, 
        required: true, 
        default: "College Administration" 
    },
    category: { 
        type: String, 
        enum: ['Academic', 'Sports', 'Seminar', 'Workshop'], 
        default: 'Academic' 
    }
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);