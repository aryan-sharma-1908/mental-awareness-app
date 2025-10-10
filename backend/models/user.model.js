const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    }
}, { timestamps: true });

userSchema.pre('save', async (next) => {
    if(!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async (candidatePassword) => {
    return await bcrypt.compare(candidatePassword, this.password);
}

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;