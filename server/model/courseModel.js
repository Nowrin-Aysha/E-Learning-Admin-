import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  freePreview: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new mongoose.Schema(
  {
    mentorId: {
      type: String,
      // required: true,
    },
    mentorName: {
      type: String,
      // required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    primaryLanguage: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    welcomeMessage: {
      type: String,
      required: true,
    },
    pricing: {
      type: Number,
      required: true,
    },
    objectives: {
      type: String,
      required: true,
    },
    students: [
      {
        studentId: {
          type: String,
          // required: true,
        },
        studentName: {
          type: String,
          // required: true,
        },
        studentEmail: {
          type: String,
          // required: true,
        },
        paidAmount: {
          type: String,
          // required: true,
        },
      },
    ],
    curriculum: [lectureSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
