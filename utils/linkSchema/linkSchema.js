import mongoose from 'mongoose'

export const LinkSchema = new mongoose.Schema({
    cat: { type: String, required: true },
    sub: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    is_ext: { type: Boolean, required: true },
    created_at: {type: Date, default: Date.now }
})

export const Link = mongoose.model('Link', LinkSchema)