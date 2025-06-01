import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function () {
    if(!this.isModified('password'))
        return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function(plain) {
    return bcrypt.compare(plain, this.password);
};
export default mongoose.model('User', userSchema); 