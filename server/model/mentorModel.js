import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: null,
  },
  status:{
    type:String,
    default:"3",
  },
  isMentor: {
    type: Boolean,
    default: true,
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

export default mongoose.models.mentor || mongoose.model('mentors', mentorSchema);
