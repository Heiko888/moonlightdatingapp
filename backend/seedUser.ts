import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User';

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hdapp');
  const email = 'user@example.com';
  const ex = await User.findOne({ email });
  if (!ex) {
    await new User({
      username: 'user',
      email,
      password: 'UserPass123',
      name: 'Max Mustermann',
    }).save();
    console.log('user created');
  } else {
    console.log('user exists');
  }
  await mongoose.disconnect();
})();
