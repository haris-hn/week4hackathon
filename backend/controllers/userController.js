const User = require('../models/User');

// @GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/user/free-trial
const activateFreeTrial = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.subscription.freeTrialUsed) {
      return res.status(400).json({ 
        message: 'Free trial already used!' 
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 din ka trial

    user.subscription = {
      plan: 'basic',
      isActive: true,
      startDate,
      endDate,
      isFreeTrial: true,
      freeTrialUsed: true
    };

    await user.save();
    res.json({ 
      message: 'Free trial activated! 7 days enjoy karo 🎉',
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/user/subscribe - Plan kharido
const subscribePlan = async (req, res) => {
  try {
    const { plan, cardNumber, cardHolder, expiryDate } = req.body;

    if (!plan || !cardNumber || !cardHolder || !expiryDate) {
      return res.status(400).json({ 
        message: 'Please provide all details!' 
      });
    }

    const plans = {
      basic: { price: 9.99, months: 1 },
      standard: { price: 12.99, months: 1 },
      premium: { price: 14.99, months: 1 }
    };

    if (!plans[plan]) {
      return res.status(400).json({ message: 'Invalid plan!' });
    }

    const user = await User.findById(req.user._id);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plans[plan].months);

    // Sirf last 4 digits save karo
    user.cardDetails = {
      last4Digits: cardNumber.slice(-4),
      cardHolder,
      expiryDate
    };

    user.subscription = {
      plan,
      isActive: true,
      startDate,
      endDate,
      isFreeTrial: false,
      freeTrialUsed: user.subscription.freeTrialUsed
    };

    await user.save();

    res.json({ 
      message: `${plan} plan activated! Enjoy StreamVibe 🎬`,
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, activateFreeTrial, subscribePlan };