import { Schema, model } from "mongoose"

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }, {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret: any) => {
                ret._id = ret._id.toString()
                delete ret.__v
            }
        }
    }
)

const User = model('user', userSchema)

export default User