import lead from "../models/lead.js";

export const createlead = async (req, res) => {
    try{
        const newlead = new lead(req.body);
        await newlead.save();
        res.status(201).json(newlead);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

export const getleads = async (req,res) => {
    try{
        const leads = await lead.find().sort({ createdAt: -1 });
        res.status(200).json(leads);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}