// Import Mongoose
const mongoose = require('mongoose');

// Define the Trial schema
const trialSchema = new mongoose.Schema({
    trialNo: { 
        type: String, 
        required: true 
    },
    caseNo: { 
        type: String, 
        required: true 
    },
    trialDate: { 
        type: Date, 
        required: true 
    },
    location: { 
        city: { 
            type: String, 
            required: true 
        },
        state: { 
            type: String, 
            required: true 
        },
        address: { 
            type: String, 
            required: true 
        },
        floor: { 
            type: String 
        },
        room: { 
            type: String 
        }
    },
    attendance: {
        plaintiffAttendance: {
            type: Boolean,
            default: false
        },
        defendantAttendance: {
            type: Boolean,
            default: false
        },
        witnessAttendance: {
            type: Boolean,
            default: false
        }
    },
    createdOn: {
        type: Date,
        default: Date.now 
    },
    updatedOn: {
        type: Date,
        default: Date.now 
    },
    verdict: {
        type: Number,
        default: 0
    }
});

const Trial = mongoose.model('Trial', trialSchema, 'trials');

module.exports = Trial;
