const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Để mã hóa mật khẩu

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phonenumber: {
        type: String,
        trim: true
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',  // Liên kết với model Role
        required: true
    }
}, {
    collection: 'users',
    timestamps: true // Thêm createdAt và updatedAt
});

// Middleware để hash password trước khi lưu
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method để kiểm tra password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 