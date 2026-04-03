/**
 * Run this once to ensure the admin user exists with correct credentials.
 * Usage: node server/seedAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
// Also try local .env
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌  MONGO_URI not set'); process.exit(1); }

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, select: false },
  role: { type: String, default: 'user' },
  googleId: { type: String, sparse: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const email = 'soso.kereselidze1@gmail.com';
  const username = 'sosokereselidze0';
  const plainPassword = 'admin0';

  const hashed = await bcrypt.hash(plainPassword, 12);

  // Upsert admin by email
  const result = await User.findOneAndUpdate(
    { $or: [{ email }, { name: username }] },
    {
      $set: {
        name: username,
        email,
        password: hashed,
        role: 'admin'
      }
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Admin user ready:`);
  console.log(`   Name  : ${result.name}`);
  console.log(`   Email : ${result.email}`);
  console.log(`   Role  : ${result.role}`);
  console.log(`\n🔑 Login with:`);
  console.log(`   Email    : ${email}  /  Password: ${plainPassword}`);
  console.log(`   Username : ${username}  /  Password: ${plainPassword}`);

  await mongoose.disconnect();
  process.exit(0);
})().catch(err => { console.error('❌', err.message); process.exit(1); });
