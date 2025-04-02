const { Router } = require("express");
const adminRouter = Router();
const{adminModel}=require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const{jwt_admin_pass}=require("../config")
const { adminmiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async function (req, res) {
    const requireBody = z.object({
        name: z.string(),
        age: z.coerce.number(), // Converts string to number
        email: z.string().email(),
        aadhar_number: z.coerce.number(),
        password: z.string().min(5).max(14),
    });
    const parsedData = requireBody.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Incorrect data",
            error: parsedData.error.errors,
        });
    }
    
    const { name, age, email, aadhar_number, password } = parsedData.data;

    try {
        // Check if user already exists
        const existingUser = await adminModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedpass = await bcrypt.hash(password, 5);
        await adminModel.create({
            name,
            age,
            email,
            aadhar_number,
            password: hashedpass,
        });

        res.status(201).json({
            message: "You are signed up",
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

adminRouter.post("/signin",async function (req,res) {
    const aadhar_number=req.body.aadhar_number;
    const password=req.body.password
    const user=await adminModel.findOne({
        aadhar_number:aadhar_number
    })
    if(!user){
        return res.status(403).status({
            message:"user not matched",
        })
    }
    const passwordMatch=await bcrypt.compare(password,user.password);
    if(passwordMatch){
        const token=jwt.sign({id:user.id},jwt_admin_pass);
        res.status(200).json({
            token:token
        })
    }
    else {
        res.status(403).json({
            message: "Invalid Credentials!", 
        });
    }
})

adminRouter.get("/profile", adminmiddleware, async function (req, res) {
    try {
        console.log("Middleware userId:", req.user); 

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No admin ID" });
        }

        const profile = await adminModel.findById(req.user);

        if (!profile) {
            return res.status(404).json({ message: "admin not found" });
        }

        //console.log("Fetched profile:", profile);
        res.json({
            message: "admin profile fetched successfully",
            profile
        });
    } catch (error) {
        console.error("Profile Fetch Error :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = {
    adminRouter,
};