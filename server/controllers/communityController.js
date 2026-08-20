import Community from '../models/Community.js';

// Get all communities
export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: communities.length, data: communities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new community
export const createCommunity = async (req, res) => {
  try {
    const { name, subject, description, icon, banner, joiningFee, creatorPayoutDetails } = req.body;

    const newCommunity = await Community.create({
      name,
      subject,
      description,
      icon: icon || '🚀',
      banner: banner || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
      joiningFee: Number(joiningFee) || 199,
      members: 1,
      membersCap: 10,
      joined: true,
      creatorId: req.user?.id || 'u1',
      creatorName: req.user?.name || 'Student Creator',
      creatorPayoutDetails: {
        upiId: creatorPayoutDetails?.upiId || `${(req.user?.name || 'creator').toLowerCase().replace(/\s+/g, '')}@upi`,
        accountName: creatorPayoutDetails?.accountName || req.user?.name || 'Community Creator',
        payoutNote: `Direct payment to creator ${creatorPayoutDetails?.accountName || req.user?.name || 'Community Creator'}`,
      },
      totalEarnings: 0,
      events: [
        {
          title: `Welcome to ${name}!`,
          time: 'Upcoming Study Lounge Session',
          host: req.user?.name || 'Community Host',
        },
      ],
    });

    res.status(201).json({ success: true, data: newCommunity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Join a community (Free cap or Paid)
export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    if (community.members >= community.membersCap && !req.body.isPaymentVerified) {
      return res.status(400).json({
        success: false,
        requiresPayment: true,
        community,
        joiningFee: community.joiningFee || 199,
        creatorPayoutDetails: community.creatorPayoutDetails,
        message: 'Free member limit (10) reached. Direct payment to creator required.',
      });
    }

    // Increment member count and credit total earnings directly to community creator
    if (community.members >= community.membersCap) {
      community.totalEarnings = (community.totalEarnings || 0) + (community.joiningFee || 199);
    }

    community.members += 1;
    community.joined = true;
    await community.save();

    res.status(200).json({
      success: true,
      data: community,
      message: community.members > 10
        ? `Joined community! ₹${community.joiningFee} payment directly transferred to creator ${community.creatorName}.`
        : 'Joined community successfully (Free Member #1-10)'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a community
export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    res.status(200).json({ success: true, message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
