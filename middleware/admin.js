const jwt = require("jsonwebtoken");
const{adminModel}=require("../db");// Import admin model
const { jwt_admin_pass } = require("../config");

async function adminmiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, jwt_admin_pass);
        console.log("Decoded JWT:", decoded);
        const user = await adminModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = { adminmiddleware };
