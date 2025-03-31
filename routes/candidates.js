const { Router } = require("express");
const candidateRouter = Router();
const { candidateModel, userModel } = require("../db");
const { adminmiddleware } = require("../middleware/admin");
const{adminModel}=require("../db");
const { usermiddleware } = require("../middleware/user");

candidateRouter.post("/insert", adminmiddleware, async function (req, res) {
    console.log("Middleware userId:", req.user);
    try {
        console.log("Middleware userId:", req.user);

        if (!req.user) {
            return res.status(401).json({ message: "User is not admin" });
        }

        const candidateinsert = await adminModel.findById(req.user);

        if (!candidateinsert) {
            return res.status(404).json({ message: "User not found" });
        } else {
            const { name, age, party, votecount, votes } = req.body;
            const newCandidate = await candidateModel.create({
                name,
                age,
                party,
                votecount,
                votes
            });
            res.status(201).json({
                message: "Candidate added successfully!",
                candidate: newCandidate
            });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});


candidateRouter.post("/vote/:candidateId",usermiddleware,async function(req,res) {
    try{
        const { candidateId } = req.params;
        const candidate=await candidateModel.findById(candidateId);
        if(!candidate){
            res.status(404).json({
                message:"candidate is not found"
            })
        }
        userId=req.user;
        const user=await userModel.findById(userId);
        if(!user){
            res.status(404).json({
                message:"user not found"
            })
        }
        if(user.is_voted){
            res.status(300).json({
                message:"user already voted"
            })
        }
        candidate.votes.push({user:userId})
        candidate.votecount++;
        await candidate.save();
        user.is_voted=true;
        await user.save();

        res.status(200).json({
            message:"voted succesfully"
        })

    }
    catch(err){
        console.error("Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
})

 candidateRouter.get("/vote/count",async function (req,res) {
    try{
      const candidate=await candidateModel.find().sort({votecount:'desc'});
      const voteRecord=candidate.map((data)=>{
     return {
        party:data.party,
        count:data.votecount
     }
      });
      res.status(200).json({
        voteRecord
      })
    }
    catch(err){
        console.error("Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
 })
module.exports = {
    candidateRouter,
};