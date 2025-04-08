import mongoose from "mongoose"

const userSchema= new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        name:{
            type:String,
            required:true,
        },
        profilePic:{
            type:String,
            default:"",
        }
    },
    {
        timestamps:true,
    }
)
const User=mongoose.model("users",userSchema);
export default User