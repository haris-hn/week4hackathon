const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  activateFreeTrial, 
  subscribePlan 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.post('/free-trial', protect, activateFreeTrial);
router.post('/subscribe', protect, subscribePlan);

module.exports = router;
