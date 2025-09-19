import 'dotenv/config';
import mongoose from 'mongoose';
import Coach from './src/models/Coach';

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hdapp');
  const email = 'coach@example.com';
  const ex = await Coach.findOne({ email });
  if (!ex) {
    await new Coach({
      name: 'Coach Max',
      email,
      password: 'CoachPass123',
      description: 'HD Coach',
      coachImage: '',
      social: '',
      focus: 'Human Design',
      bio: 'Erfahrener Coach für Human Design',
    }).save();
    console.log('coach created');
  } else {
    console.log('coach exists');
  }
  await mongoose.disconnect();
})();
