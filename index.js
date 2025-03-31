require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const {userRouter}=require("./routes/user");
const {adminRouter}=require("./routes/admin");
const {candidateRouter}=require("./routes/candidates");
const app=express();
app.use(express.json())

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/candidate",candidateRouter);

async function main(){
    await mongoose.connect(process.env.mongo_url);
    
    app.listen(3001);
    }
    main();
    console.log("port 3001 started")