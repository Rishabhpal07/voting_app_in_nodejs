const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=Schema.Types.ObjectId
console.log("db is connected")

const userSchema=new Schema({
  name:{type:String,require:true},
  age:{type:Number,require:true},
  email:{type:String,require:true},
  aadhar_number:{type:String,require:true,unique:true},
  password:{type:String,require:true},
  is_voted:{type:Boolean,default:false}
})
const adminSchema=new Schema({
    name:{type:String,require:true},
    age:{type:Number,require:true},
    email:{type:String,require:true},
    aadhar_number:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    //isvoted:{type:boolean,default:false}
  })

  const candidateSchema=new Schema({
    name:{type:String,require:true},
    party:{type:String,require:true},
    age:{type:Number,require:true},
    votecount:{type:Number,default:0},
    votes:[{
        user:{
            type:ObjectId,
            ref:"User",
            require:true
        },
        votedAt:{
           type:Date,
           default:Date.now()
        }
    }]
  })

const userModel=mongoose.model("user",userSchema);
const adminModel=mongoose.model("admin",adminSchema);
const candidateModel=mongoose.model("candidate",candidateSchema);
module.exports={
    userModel,
    adminModel,
    candidateModel
}