import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
}, { _id: false });

const aiChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  messages: [messageSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a TTL index on 'updatedAt' that automatically deletes the document
// after 30 days (30 days * 24 hours * 60 minutes * 60 seconds = 2592000 seconds)
aiChatSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 2592000 });

const AIChat = mongoose.model('AIChat', aiChatSchema);
export default AIChat;
