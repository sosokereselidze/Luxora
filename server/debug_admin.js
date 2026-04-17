const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected...');
        
        const email = process.env.ADMIN_EMAIL;
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('User NOT found with email:', email);
        } else {
            console.log('User Found:');
            console.log(' - Name:', user.name);
            console.log(' - Username:', user.username);
            console.log(' - Email:', user.email);
            console.log(' - Role:', user.role);
            console.log(' - Password Hash length:', user.password.length);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
