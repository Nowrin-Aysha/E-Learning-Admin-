import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  name: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
    // required: true,
    match: /^[0-9]{10}$/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user',
  },
  gender: {
    type: String,
    // required: true,
    enum: ['male', 'female', 'other'],
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
    default: null,
  },
  isBlocked:{
    type: Boolean,
    default: false,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.adminModel || mongoose.model('adminModels', adminSchema);
