import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const Leadschema= new mongoose.Schema({
    leadId: { 
        type: String, 
        default: uuidv4, 
        unique: true },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    altphone : String,
    email: {
        type: String,
        required: true
    },
    altemail : String,
    status: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    interestfield: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    assignedto: {
        type: String,
        required: true
    },
    jobinterest: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    passoutyear: {
        type: Number,
        required: true
    },
    heardfrom: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const lead= mongoose.model('lead', Leadschema);
export default lead;

