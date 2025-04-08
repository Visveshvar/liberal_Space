import mongoose from "mongoose"
const spacesSchema = new mongoose.Schema(
    {
        spaceName: {
            type: String,
            required: true,
        },
        adminId: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        members: [
            {
                memberId: {
                    type: String,
                    required: true,
                },
            },
        ],
        

    },
    {
        timestamps: true,
    }
)
const Space = mongoose.model("spaces", spacesSchema)
export default Space