import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Community name is required'],
      trim: true,
    },
    subject: {
      type: String,
      default: 'General Study',
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: '🚀',
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    },
    joiningFee: {
      type: Number,
      default: 199,
    },
    members: {
      type: Number,
      default: 1,
    },
    membersCap: {
      type: Number,
      default: 10,
    },
    joined: {
      type: Boolean,
      default: false,
    },
    creatorId: {
      type: String,
      default: 'u1',
    },
    creatorName: {
      type: String,
      default: 'Student Creator',
    },
    creatorPayoutDetails: {
      upiId: {
        type: String,
        default: 'creator@upi',
      },
      accountName: {
        type: String,
        default: 'Community Creator',
      },
      qrCodeUrl: {
        type: String,
        default: '',
      },
      payoutNote: {
        type: String,
        default: 'Direct payout to Community Creator account',
      },
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    activeVoiceRooms: {
      type: Number,
      default: 1,
    },
    events: [
      {
        title: String,
        time: String,
        host: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Community', communitySchema);
