import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: '',
    },
    lastSenderId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
