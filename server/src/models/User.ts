import { Schema, model } from 'mongoose'
import { IUser } from '../types'

const userSchema = new Schema<IUser>({

    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    refreshToken: {
        type: String,
        required: false
    },

}, { timestamps: true })

const User = model<IUser>('User', userSchema)

export default User