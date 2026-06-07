const GymClass = require('../models/GymClass');

const defaultClasses = [
  {
    name: 'MMA Championship Training',
    category: 'Cardio',
    level: 'Intermediate',
    trainer: 'Coach Yasmine',
    time: '06:00 AM',
    duration: 60,
    capacity: 15,
    booked: 0,
    room: 'Studio A',
    description: 'Full-contact fighting conditioning blended with explosive HIIT circuits. Build knockout power, footwork, and elite cardio endurance. Led by ex-national champion Coach Yasmine.',
    image: 'https://www.trxtraining.com/cdn/shop/articles/mma-fighter-workout-training-plan_e5c7f6f7-c3d0-4410-8af7-e2a02397c967.jpg?v=1775795865',
    badges: ['HIIT', 'OFFER'],
  },
  {
    name: 'Barbell Mastery',
    category: 'Strength',
    level: 'Advanced',
    trainer: 'Coach Omar',
    time: '18:00 PM',
    duration: 75,
    capacity: 12,
    booked: 0,
    room: 'Weights Floor',
    description: 'A deep dive into the king of lifts — squat, bench, and deadlift. Perfect form, progressive overload programming, and real strength gains every session.',
    image: 'https://trugrit-fitness.com/cdn/shop/articles/Fo7_-Q0g.jpg?crop=center&height=1200&v=1638407838&width=1200',
    badges: ['STRENGTH', 'OFFER'],
  },
  {
    name: 'Mobility Flow',
    category: 'Recovery',
    level: 'Beginner',
    trainer: 'Coach Zeyad',
    time: '09:00 AM',
    duration: 50,
    capacity: 20,
    booked: 0,
    room: 'Mind-Body Studio',
    description: 'Restore your range of motion, fix imbalances, and bulletproof your joints. A mix of yoga, dynamic stretching, and fascia work for long-term athletic longevity.',
    image: '/images/mobility-flow.jpg',
    badges: ['RECOVERY', 'OFFER'],
  },
  {
    name: 'Boxing Supremacy',
    category: 'Combat',
    level: 'Intermediate',
    trainer: 'Coach Yasmine',
    time: '19:00 PM',
    duration: 60,
    capacity: 10,
    booked: 0,
    room: 'Fight Zone',
    description: 'Learn to punch with power and precision. Heavy bags, mitts, and sparring drills designed to sharpen reflexes, melt fat, and build the heart of a fighter.',
    image: 'https://americangym.com/wp-content/uploads/boxing7.webp',
    badges: ['COMBAT', 'OFFER'],
  },
];

async function seedClasses() {
  const count = await GymClass.countDocuments();
  if (count === 0) {
    await GymClass.insertMany(defaultClasses);
    console.log('Default classes seeded.');
  }
}

module.exports = seedClasses;
