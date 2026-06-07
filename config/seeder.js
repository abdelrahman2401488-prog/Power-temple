const GymClass = require('../models/GymClass');
const Product = require('../models/Product');

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
    image: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=1200',
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

const defaultProducts = [
  { name: 'Nitro Surge Extreme', category: 'pre-workout', price: 650, unit: '/30 srv', badge: 'Best Seller', image: 'https://tse1.mm.bing.net/th/id/OIP.pAFfcYnkE5t4X_PylLlFWwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Max-dosed pre-workout with 350mg caffeine, 6g citrulline malate, and beta-alanine for unstoppable pumps and laser focus.', stock: 24 },
  { name: 'Ignite V2 Stim-Free', category: 'pre-workout', price: 520, unit: '/30 srv', badge: 'New', image: 'https://i5.walmartimages.com/asr/085a6524-c3e0-4d88-98a8-856bcc58466e.a81bfe065e50c8d70dea9da3f1b7b9b4.jpeg?odnHeight=784&odnWidth=580&odnBg=FFFFFF', description: 'Caffeine-free formula with peak O2, alpha-GPC, and electrolytes. Train harder, longer — no crash guaranteed.', stock: 18 },
  { name: 'PT Whey Gold', category: 'protein', price: 1200, unit: '/2kg', badge: 'Top Rated', image: 'https://i.pinimg.com/736x/52/c3/0a/52c30aeeb8ea2e358fcc91656fe147bf.jpg', description: '25g ultra-pure whey isolate per scoop. Cold-processed for maximum bioavailability. 5g BCAAs, less than 1g sugar.', stock: 30 },
  { name: 'Night Fuel Casein', category: 'protein', price: 980, unit: '/1.8kg', badge: '', image: 'https://www.proteini.si/en/image/original/1244/usn-casein-night-time-protein-908g', description: 'Slow-digesting micellar casein for overnight muscle recovery. 24g protein, rich pudding-like texture. Perfect before bed.', stock: 14 },
  { name: 'Pure Creatine Mono', category: 'creatine', price: 320, unit: '/500g', badge: 'Essential', image: 'https://i.pinimg.com/1200x/4e/dc/2d/4edc2d9014915f13029978d1610bf030.jpg', description: '5g pharmaceutical-grade creatine monohydrate per serving. Micronized for instant dissolve. Unflavored — stack with anything.', stock: 45 },
  { name: 'Creatine HCL Advanced', category: 'creatine', price: 480, unit: '/90 srv', badge: '', image: 'https://supplementsource.ca/cdn/shop/products/SSca-Creatine-HCL-421698_1200x1200.jpg?v=1625854115', description: 'More soluble than monohydrate, less bloating. 3g per serving for maximum strength output and rapid ATP regeneration.', stock: 22 },
  { name: 'Power Bar Crunch', category: 'bars', price: 75, unit: '/bar', badge: 'Fan Fav', image: 'https://i.pinimg.com/736x/5d/d3/e9/5dd3e9cd50689af61e9d06cf7da1f93d.jpg', description: '20g protein, crunchy peanut coating, real chocolate. Only 220 calories. No sugar alcohols — actually tastes amazing.', stock: 120 },
  { name: 'Elite Multi Daily', category: 'vitamins', price: 390, unit: '/60 caps', badge: '', image: 'https://i.pinimg.com/736x/3c/7c/fe/3c7cfe1aed9035f1e3d10fcf1405784b.jpg', description: '30+ essential vitamins and minerals optimized for athletes. Vitamin D3, K2, zinc, magnesium, B-complex in one daily pack.', stock: 36 },
  { name: 'Omega-3 Ultra Strength', category: 'vitamins', price: 450, unit: '/90 caps', badge: '', image: 'https://flex.darrelwilson.com/nutranest/storage/sites/140/2024/06/High-Strength-Omega-3.png', description: '3000mg EPA/DHA per serving. Molecularly distilled, mercury-free. Supports joint health, brain function, and recovery speed.', stock: 28 },
  { name: 'BCAA 2:1:1 Intra', category: 'recovery', price: 540, unit: '/30 srv', badge: 'Popular', image: 'https://i.pinimg.com/1200x/e4/50/78/e450785f058c7841976529d4c537b9c6.jpg', description: '10g BCAAs in the clinical 2:1:1 ratio. Added electrolytes and glutamine for hydration and muscle preservation during training.', stock: 20 },
  { name: 'L-Glutamine Pure', category: 'recovery', price: 280, unit: '/300g', badge: '', image: 'https://i.pinimg.com/1200x/9a/79/70/9a7970c56cfb78347c28f8b3bd6d08c9.jpg', description: '5g pure pharmaceutical glutamine per serving. Supports gut health, immune system, and reduces post-workout soreness significantly.', stock: 19 },
];

async function seedClasses() {
  const count = await GymClass.countDocuments();
  if (count === 0) {
    await GymClass.insertMany(defaultClasses);
    console.log('Default classes seeded.');
  }
}

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(defaultProducts);
    console.log('Default products seeded.');
  }
}

module.exports = { seedClasses, seedProducts };
