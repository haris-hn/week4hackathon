const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@stream.com',
    password: 'admin123',
    role: 'admin'
  });

  console.log('✅ Admin Created:', admin.email);
  process.exit();
};

createAdmin();