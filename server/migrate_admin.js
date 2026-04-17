const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const migrateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Admin Migration...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;

    if (!adminEmail || !adminPassword || !adminUsername) {
      console.error('Admin credentials missing in .env');
      process.exit(1);
    }

    // 1. Delete all existing admins EXCEPT possibly the new one if it exists
    const deleteResult = await User.deleteMany({ 
      role: 'admin', 
      email: { $ne: adminEmail } 
    });
    console.log(`Deleted ${deleteResult.deletedCount} existing administrators.`);

    // 2. Upsert the new primary admin
    const user = await User.findOne({ email: adminEmail });
    
    if (user) {
      console.log('Primary admin already exists. Updating credentials...');
      user.name = adminUsername;
      user.username = adminUsername;
      user.password = adminPassword;
      user.role = 'admin';
      await user.save();
    } else {
      console.log('Creating new primary administrator...');
      await User.create({
        name: adminUsername,
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
    }

    console.log('Admin migration successful.');
    console.log(`Email: ${adminEmail}`);
    console.log(`Username: ${adminUsername}`);
    console.log('All other administrators have been removed.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateAdmin();
