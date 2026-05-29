/* =================================
   POWER TEMPLE - API MOCK DATABASE
   ================================= */

// Mock data structure simulating backend API
const PowerTempleAPI = {
  // === USERS DATA ===
  users: [],

  // === TRAINERS DATA ===
  trainers: [
    {
      id: 1,
      name: 'Coach Omar',
      username: 'coach_omar',
      specialty: 'Strength & Power',
      rating: 4.9,
      sessionsPerWeek: 12,
      totalMembers: 45,
      status: 'active',
      bio: 'Olympic lifting specialist with 10+ years experience',
    },
    {
      id: 2,
      name: 'Coach Yasmine',
      username: 'coach_yasmine',
      specialty: 'Cardio & Conditioning',
      rating: 4.8,
      sessionsPerWeek: 9,
      totalMembers: 38,
      status: 'active',
      bio: 'HIIT certified trainer, passionate about cardio performance',
    },
    {
      id: 3,
      name: 'Coach Zeyad',
      username: 'coach_zeyad',
      specialty: 'Recovery & Mobility',
      rating: 4.9,
      sessionsPerWeek: 8,
      totalMembers: 32,
      status: 'active',
      bio: 'Yoga & mobility expert, helps members prevent injuries',
    },
    {
      id: 4,
      name: 'Coach Ahmed',
      username: 'coach_ahmed',
      specialty: 'Combat Sports',
      rating: 4.7,
      sessionsPerWeek: 7,
      totalMembers: 28,
      status: 'active',
      bio: 'Boxing & kickboxing specialist, builds explosive power',
    },
    {
      id: 5,
      name: 'Coach Hana',
      username: 'coach_hana',
      specialty: 'General Fitness',
      rating: 4.6,
      sessionsPerWeek: 6,
      totalMembers: 20,
      status: 'part-time',
      bio: 'Functional fitness trainer, 5 years experience',
    },
  ],

  // === CLASSES DATA ===
  classes: [
    {
      id: 1,
      name: 'MMA Championship Training',
      category: 'Cardio',
      level: 'Intermediate',
      trainer: 'Coach Omar',
      trainerId: 1,
      time: '06:00 AM',
      duration: 45,
      capacity: 18,
      booked: 15,
      room: 'Studio A',
      description: 'High-intensity interval training with explosive movements and maximum calorie burn.',
      rating: 4.9,
      image: '⚡',
    },
    {
      id: 2,
      name: 'Barbell Mastery',
      category: 'Strength',
      level: 'Advanced',
      trainer: 'Coach Yasmine',
      trainerId: 2,
      time: '18:00 PM',
      duration: 60,
      capacity: 20,
      booked: 20,
      room: 'Weights Floor',
      description: 'Advanced strength programming with Olympic lifts and powerlifting technique.',
      rating: 4.8,
      image: '🏋️',
    },
    {
      id: 3,
      name: 'Mobility Flow',
      category: 'Recovery',
      level: 'Beginner',
      trainer: 'Coach Zeyad',
      trainerId: 3,
      time: '09:00 AM',
      duration: 50,
      capacity: 20,
      booked: 8,
      room: 'Mind-Body Studio',
      description: 'Deep stretching and mobility work to enhance flexibility and recovery.',
      rating: 4.9,
      image: '🧘',
    },
    {
      id: 4,
      name: 'Boxing Supremacy',
      category: 'Combat',
      level: 'Intermediate',
      trainer: 'Coach Ahmed',
      trainerId: 4,
      time: '19:00 PM',
      duration: 55,
      capacity: 16,
      booked: 12,
      room: 'Fight Zone',
      description: 'Pad work and footwork drills with focus on explosive power and mental toughness.',
      rating: 4.7,
      image: '🥊',
    },
    {
      id: 5,
      name: 'Core Crusher',
      category: 'Strength',
      level: 'Beginner',
      trainer: 'Coach Hana',
      trainerId: 5,
      time: '10:00 AM',
      duration: 40,
      capacity: 25,
      booked: 18,
      room: 'Studio B',
      description: 'Functional core training for stability, strength, and injury prevention.',
      rating: 4.5,
      image: '💪',
    },
    {
      id: 6,
      name: 'Spin Revolution',
      category: 'Cardio',
      level: 'Beginner',
      trainer: 'Coach Yasmine',
      trainerId: 2,
      time: '17:00 PM',
      duration: 45,
      capacity: 30,
      booked: 27,
      room: 'Spin Studio',
      description: 'High-energy cycling workout with great music and motivating atmosphere.',
      rating: 4.8,
      image: '🚴',
    },
  ],

  // === MONTHLY MEMBERSHIP PLANS ===
  membershipPlans: [
    { id: 'starter', name: 'Starter', monthlyPrice: 600 },
    { id: 'elite', name: 'Elite', monthlyPrice: 900 },
    { id: 'pro', name: 'Pro', monthlyPrice: 1200 },
    { id: 'champion', name: 'Champion', monthlyPrice: 1500 },
  ],

  // === SHOP PRODUCTS ===
  products: [
    { id: 1, name: 'Nitro Surge Extreme', category: 'pre-workout', price: 650, unit: '/30 srv', badge: 'Best Seller', image: 'https://tse1.mm.bing.net/th/id/OIP.pAFfcYnkE5t4X_PylLlFWwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Max-dosed pre-workout with 350mg caffeine, 6g citrulline malate, and beta-alanine for unstoppable pumps and laser focus.', stock: 24 },
    { id: 2, name: 'Ignite V2 Stim-Free', category: 'pre-workout', price: 520, unit: '/30 srv', badge: 'New', image: 'https://i5.walmartimages.com/asr/085a6524-c3e0-4d88-98a8-856bcc58466e.a81bfe065e50c8d70dea9da3f1b7b9b4.jpeg?odnHeight=784&odnWidth=580&odnBg=FFFFFF', description: 'Caffeine-free formula with peak O2, alpha-GPC, and electrolytes. Train harder, longer — no crash guaranteed.', stock: 18 },
    { id: 3, name: 'PT Whey Gold', category: 'protein', price: 1200, unit: '/2kg', badge: 'Top Rated', image: 'https://i.pinimg.com/736x/52/c3/0a/52c30aeeb8ea2e358fcc91656fe147bf.jpg', description: '25g ultra-pure whey isolate per scoop. Cold-processed for maximum bioavailability. 5g BCAAs, less than 1g sugar.', stock: 30 },
    { id: 4, name: 'Night Fuel Casein', category: 'protein', price: 980, unit: '/1.8kg', badge: '', image: 'https://www.proteini.si/en/image/original/1244/usn-casein-night-time-protein-908g', description: 'Slow-digesting micellar casein for overnight muscle recovery. 24g protein, rich pudding-like texture. Perfect before bed.', stock: 14 },
    { id: 5, name: 'Pure Creatine Mono', category: 'creatine', price: 320, unit: '/500g', badge: 'Essential', image: 'https://i.pinimg.com/1200x/4e/dc/2d/4edc2d9014915f13029978d1610bf030.jpg', description: '5g pharmaceutical-grade creatine monohydrate per serving. Micronized for instant dissolve. Unflavored — stack with anything.', stock: 45 },
    { id: 6, name: 'Creatine HCL Advanced', category: 'creatine', price: 480, unit: '/90 srv', badge: '', image: 'https://supplementsource.ca/cdn/shop/products/SSca-Creatine-HCL-421698_1200x1200.jpg?v=1625854115', description: 'More soluble than monohydrate, less bloating. 3g per serving for maximum strength output and rapid ATP regeneration.', stock: 22 },
    { id: 7, name: 'Power Bar Crunch', category: 'bars', price: 75, unit: '/bar', badge: 'Fan Fav', image: 'https://i.pinimg.com/736x/5d/d3/e9/5dd3e9cd50689af61e9d06cf7da1f93d.jpg', description: '20g protein, crunchy peanut coating, real chocolate. Only 220 calories. No sugar alcohols — actually tastes amazing.', stock: 120 },
    { id: 8, name: 'Elite Multi Daily', category: 'vitamins', price: 390, unit: '/60 caps', badge: '', image: 'https://i.pinimg.com/736x/3c/7c/fe/3c7cfe1aed9035f1e3d10fcf1405784b.jpg', description: '30+ essential vitamins and minerals optimized for athletes. Vitamin D3, K2, zinc, magnesium, B-complex in one daily pack.', stock: 36 },
    { id: 9, name: 'Omega-3 Ultra Strength', category: 'vitamins', price: 450, unit: '/90 caps', badge: '', image: 'https://flex.darrelwilson.com/nutranest/storage/sites/140/2024/06/High-Strength-Omega-3.png', description: '3000mg EPA/DHA per serving. Molecularly distilled, mercury-free. Supports joint health, brain function, and recovery speed.', stock: 28 },
    { id: 10, name: 'BCAA 2:1:1 Intra', category: 'recovery', price: 540, unit: '/30 srv', badge: 'Popular', image: 'https://i.pinimg.com/1200x/e4/50/78/e450785f058c7841976529d4c537b9c6.jpg', description: '10g BCAAs in the clinical 2:1:1 ratio. Added electrolytes and glutamine for hydration and muscle preservation during training.', stock: 20 },
    { id: 11, name: 'L-Glutamine Pure', category: 'recovery', price: 280, unit: '/300g', badge: '', image: 'https://i.pinimg.com/1200x/9a/79/70/9a7970c56cfb78347c28f8b3bd6d08c9.jpg', description: '5g pure pharmaceutical glutamine per serving. Supports gut health, immune system, and reduces post-workout soreness significantly.', stock: 19 },
  ],

  // === DISCOUNTS / PROMOTIONS ===
  discounts: [
    { id: 1, code: 'SAVE10', type: 'percentage', amount: 10, minOrder: 0, active: true, uses: 47, description: '10% off any plan' },
    { id: 2, code: 'POWER15', type: 'percentage', amount: 15, minOrder: 1000, active: true, uses: 23, description: '15% off orders LE 1000+' },
    { id: 3, code: 'WELCOME20', type: 'percentage', amount: 20, minOrder: 2000, active: true, uses: 12, description: 'New member welcome — 20% off LE 2000+' },
    { id: 4, code: 'SUMMER25', type: 'percentage', amount: 25, minOrder: 0, active: false, uses: 84, description: 'Summer campaign (expired)' },
  ],

  // === MEMBER MEMBERSHIPS (individual subscription records) ===
  memberMemberships: [
    { id: 1, memberId: 5, memberName: 'John Doe', planId: 'elite', planName: 'Elite', status: 'active', startDate: '2025-06-15', endDate: '2026-06-15', monthlyPrice: 59, branch: 'Maadi' },
    { id: 2, memberId: 6, memberName: 'Jane Smith', planId: 'pro', planName: 'Pro', status: 'active', startDate: '2025-08-20', endDate: '2026-08-20', monthlyPrice: 89, branch: 'Zamalek' },
    { id: 3, memberId: 8, memberName: 'Sara Hassan', planId: 'champion', planName: 'Champion', status: 'active', startDate: '2025-03-10', endDate: '2026-03-10', monthlyPrice: 149, branch: 'Maadi' },
    { id: 4, memberId: 9, memberName: 'Karim Nasser', planId: 'starter', planName: 'Starter', status: 'suspended', startDate: '2025-11-01', endDate: '2026-11-01', monthlyPrice: 19, branch: 'Maadi' },
  ],

  // === PERSONAL TRAINING REQUESTS ===
  personalTrainingRequests: [
    { id: 1, memberId: 5, memberName: 'John Doe', trainerId: 1, trainerName: 'Coach Omar', sessionType: 'Strength', date: '2026-06-01', time: '07:00 AM', status: 'confirmed', notes: 'Focus on deadlift form' },
    { id: 2, memberId: 6, memberName: 'Jane Smith', trainerId: 2, trainerName: 'Coach Yasmine', sessionType: 'Cardio', date: '2026-06-02', time: '18:00 PM', status: 'pending', notes: 'Beginner HIIT' },
  ],

  // === PAYMENT RECORDS (seeded with sample data for admin/manager view) ===
  payments: [
    { id: 1, memberId: 5, memberName: 'John Doe', amount: 59, method: 'visa', status: 'paid', paidAt: '2026-05-01T10:30:00Z', last4: '4242', description: 'Elite Monthly Subscription' },
    { id: 2, memberId: 6, memberName: 'Jane Smith', amount: 89, method: 'mastercard', status: 'paid', paidAt: '2026-05-03T14:00:00Z', last4: '1234', description: 'Pro Monthly Subscription' },
    { id: 3, memberId: 5, memberName: 'John Doe', amount: 1200, method: 'cash', status: 'paid', paidAt: '2026-05-05T09:00:00Z', last4: 'CASH', description: 'MMA Class Booking' },
    { id: 4, memberId: 8, memberName: 'Sara Hassan', amount: 149, method: 'visa', status: 'paid', paidAt: '2026-05-10T11:00:00Z', last4: '8814', description: 'Champion Monthly Subscription' },
    { id: 5, memberId: 9, memberName: 'Karim Nasser', amount: 19, method: 'cash', status: 'paid', paidAt: '2026-05-12T16:15:00Z', last4: 'CASH', description: 'Starter Monthly Subscription' },
    { id: 6, memberId: 6, memberName: 'Jane Smith', amount: 1000, method: 'mastercard', status: 'refunded', paidAt: '2026-05-15T13:00:00Z', last4: '1234', description: 'Cancelled Barbell Class' },
  ],

  // === MEMBER BOOKINGS ===
  bookings: [
    {
      id: 1,
      memberId: 5,
      classId: 1,
      className: 'MMA Championship Training',
      trainer: 'Coach Omar',
      date: 'Tomorrow',
      time: '06:00 AM',
      room: 'Studio A',
      status: 'confirmed',
      attendanceStatus: 'upcoming',
    },
    {
      id: 2,
      memberId: 5,
      classId: 3,
      className: 'Mobility Flow',
      trainer: 'Coach Zeyad',
      date: 'Thursday',
      time: '09:00 AM',
      room: 'Mind-Body Studio',
      status: 'confirmed',
      attendanceStatus: 'upcoming',
    },
    {
      id: 3,
      memberId: 5,
      classId: 4,
      className: 'Boxing Supremacy',
      trainer: 'Coach Ahmed',
      date: 'Saturday',
      time: '19:00 PM',
      room: 'Fight Zone',
      status: 'confirmed',
      attendanceStatus: 'upcoming',
    },
    {
      id: 4,
      memberId: 5,
      classId: 2,
      className: 'Barbell Mastery',
      trainer: 'Coach Yasmine',
      date: 'Last Monday',
      time: '18:00 PM',
      room: 'Weights Floor',
      status: 'completed',
      attendanceStatus: 'attended',
    },
  ],

  // === ATTENDANCE RECORDS ===
  attendance: [
    {
      classId: 1,
      className: 'MMA Championship Training',
      date: '2025-01-18',
      totalSpots: 18,
      attended: 15,
      noShow: 2,
      cancelled: 1,
      members: [
        { name: 'John Doe', status: 'attended' },
        { name: 'Jane Smith', status: 'attended' },
        { name: 'Mike Johnson', status: 'late', minutes: 5 },
        { name: 'Sarah Williams', status: 'attended' },
        { name: 'Empty Slot', status: 'no-show' },
      ],
    },
    {
      classId: 2,
      className: 'Barbell Mastery',
      date: '2025-01-18',
      totalSpots: 20,
      attended: 18,
      noShow: 1,
      cancelled: 1,
      members: [
        { name: 'John Doe', status: 'attended' },
        { name: 'Alex Chen', status: 'attended' },
        { name: 'Emma Davis', status: 'attended' },
      ],
    },
  ],

  // === MEALS DATABASE ===
  meals: {
    proteins: [
      { name: 'Chicken Breast', protein: 31, serving: '100g' },
      { name: 'Salmon', protein: 25, serving: '100g' },
      { name: 'Beef Lean', protein: 26, serving: '100g' },
      { name: 'Eggs', protein: 13, serving: '1 large' },
      { name: 'Greek Yogurt', protein: 10, serving: '100g' },
      { name: 'Whey Protein', protein: 25, serving: '1 scoop' },
      { name: 'Tuna', protein: 26, serving: '100g' },
      { name: 'Cottage Cheese', protein: 11, serving: '100g' },
    ],
    carbs: [
      { name: 'Oatmeal', carbs: 54, serving: '100g' },
      { name: 'Brown Rice', carbs: 23, serving: '100g' },
      { name: 'Sweet Potato', carbs: 20, serving: '100g' },
      { name: 'White Rice', carbs: 28, serving: '100g' },
      { name: 'Whole Wheat Bread', carbs: 47, serving: '100g' },
      { name: 'Banana', carbs: 27, serving: '1 medium' },
      { name: 'Pasta', carbs: 31, serving: '100g cooked' },
      { name: 'Quinoa', carbs: 39, serving: '100g' },
    ],
    fats: [
      { name: 'Olive Oil', fat: 14, serving: '1 tbsp' },
      { name: 'Almonds', fat: 14, serving: '1 oz' },
      { name: 'Avocado', fat: 10, serving: '100g' },
      { name: 'Peanut Butter', fat: 16, serving: '2 tbsp' },
      { name: 'Coconut Oil', fat: 14, serving: '1 tbsp' },
      { name: 'Walnuts', fat: 19, serving: '1 oz' },
      { name: 'Chia Seeds', fat: 9, serving: '1 oz' },
      { name: 'Flaxseeds', fat: 12, serving: '1 oz' },
    ],
  },

  // === UTILITY FUNCTIONS ===

  // Find user by credentials (username or email)
  findUser: function (identifier, password) {
    return this.users.find(
      (user) =>
        (user.username === identifier || user.email === identifier) &&
        user.password === password
    );
  },

  // Get user by ID
  getUserById: function (id) {
    return this.users.find((user) => user.id === id);
  },

  // Check if email already exists
  emailExists: function (email) {
    return this.users.some((user) => user.email === email);
  },

  // Register new user (member)
  registerUser: function (userData) {
    const newUser = {
      id: this.users.length + 1,
      ...userData,
      role: 'member',
      avatar: '👤',
      membershipTier: 'Starter',
      joiningDate: new Date().toISOString().split('T')[0],
      totalBookings: 0,
    };
    this.users.push(newUser);
    return newUser;
  },

  // Get all classes
  getAllClasses: function () {
    return this.classes;
  },

  // Get class by ID
  getClassById: function (id) {
    return this.classes.find((c) => c.id === id);
  },

  // Book a class for a member
  bookClass: function (memberId, classId) {
    const classData = this.getClassById(classId);
    if (!classData || classData.booked >= classData.capacity) {
      return { success: false, message: 'Class is full or does not exist' };
    }

    // Check if already booked
    const alreadyBooked = this.bookings.some(
      (b) => b.memberId === memberId && b.classId === classId
    );
    if (alreadyBooked) {
      return { success: false, message: 'Already booked this class' };
    }

    const newBooking = {
      id: this.bookings.length + 1,
      memberId,
      classId,
      className: classData.name,
      trainer: classData.trainer,
      date: 'Tomorrow',
      time: classData.time,
      room: classData.room,
      status: 'confirmed',
      attendanceStatus: 'upcoming',
    };

    this.bookings.push(newBooking);
    classData.booked++;

    return { success: true, booking: newBooking, message: 'Class booked successfully!' };
  },

  processPayment: function (paymentData) {
    const { memberId, amount, method, cardNumber } = paymentData;

    if (!amount || amount <= 0) {
      return { success: false, message: 'Invalid payment amount' };
    }

    if (!method) {
      return { success: false, message: 'Please choose a payment method' };
    }

    if (method !== 'cash' && (!cardNumber || cardNumber.replace(/\s/g, '').length < 12)) {
      return { success: false, message: 'Please enter a valid card number' };
    }

    const payment = {
      id: this.payments.length + 1,
      memberId,
      amount,
      method,
      status: 'paid',
      paidAt: new Date().toISOString(),
      last4: method === 'cash' ? 'CASH' : cardNumber.replace(/\s/g, '').slice(-4),
    };

    this.payments.push(payment);
    return { success: true, payment };
  },

  subscribePlan: function (memberId, planId, paymentData) {
    const plan = this.membershipPlans.find((item) => item.id === planId);
    const member = this.getUserById(memberId);

    if (!member || member.role !== 'member') {
      return { success: false, message: 'Member account not found' };
    }

    if (!plan) {
      return { success: false, message: 'Selected subscription plan is invalid' };
    }

    const paymentResult = this.processPayment({
      ...paymentData,
      memberId,
      amount: plan.monthlyPrice,
    });

    if (!paymentResult.success) {
      return paymentResult;
    }

    member.membershipTier = plan.name;
    member.subscription = {
      planId: plan.id,
      monthlyPrice: plan.monthlyPrice,
      startedAt: new Date().toISOString(),
      status: 'active',
    };

    return {
      success: true,
      plan,
      payment: paymentResult.payment,
      message: `${plan.name} monthly subscription activated successfully!`,
    };
  },

  bookClassWithPayment: function (memberId, classId, paymentData) {
    const classData = this.getClassById(classId);
    if (!classData) {
      return { success: false, message: 'Class not found' };
    }

    const classFeeByClassId = {
      1: 1000, // MMA Championship Training
      3: 1400, // Mobility Flow
      4: 1200, // Boxing Supremacy
    };

    const classFee = classFeeByClassId[classId] || Number(paymentData?.amount || 0);
    if (!classFee || classFee <= 0) {
      return { success: false, message: 'Invalid class fee amount' };
    }

    const paymentResult = this.processPayment({
      ...paymentData,
      memberId,
      amount: classFee,
    });

    if (!paymentResult.success) {
      return paymentResult;
    }

    const bookingResult = this.bookClass(memberId, classId);
    if (!bookingResult.success) {
      return bookingResult;
    }

    return {
      ...bookingResult,
      payment: paymentResult.payment,
      classFee,
      message: 'Class booked and paid successfully!',
    };
  },

  // Cancel a booking
  cancelBooking: function (bookingId) {
    const bookingIndex = this.bookings.findIndex((b) => b.id === bookingId);
    if (bookingIndex === -1) {
      return { success: false, message: 'Booking not found' };
    }

    const booking = this.bookings[bookingIndex];
    const classData = this.getClassById(booking.classId);

    // Remove booking
    this.bookings.splice(bookingIndex, 1);
    classData.booked--;

    return { success: true, message: 'Booking cancelled' };
  },

  // Get member bookings
  getMemberBookings: function (memberId) {
    return this.bookings.filter((b) => b.memberId === memberId);
  },

  // Get trainer schedule
  getTrainerSchedule: function (trainerId) {
    return this.classes.filter((c) => c.trainerId === trainerId);
  },

  // Get class attendance
  getClassAttendance: function (classId) {
    return this.attendance.find((a) => a.classId === classId);
  },

  // Add new trainer
  addTrainer: function (trainerData) {
    const newTrainer = {
      id: this.trainers.length + 1,
      ...trainerData,
      rating: 4.5,
      sessionsPerWeek: 0,
      totalMembers: 0,
      status: 'active',
    };
    this.trainers.push(newTrainer);
    return newTrainer;
  },

  // Add new class
  addClass: function (classData) {
    const newClass = {
      id: this.classes.length + 1,
      ...classData,
      booked: 0,
      rating: 4.5,
    };
    this.classes.push(newClass);
    return newClass;
  },

  // Get dashboard stats
  getDashboardStats: function () {
    return {
      totalTrainers: this.trainers.length,
      totalClasses: this.classes.length,
      totalBookings: this.bookings.length,
      totalMembers: this.users.filter((u) => u.role === 'member').length,
      totalSpots: this.classes.reduce((sum, c) => sum + (c.capacity - c.booked), 0),
      averageRating: (
        this.classes.reduce((sum, c) => sum + c.rating, 0) / this.classes.length
      ).toFixed(1),
    };
  },

  // === EXTENDED METHODS ===

  // Remove trainer (admin)
  removeTrainer: function (trainerId) {
    const idx = this.trainers.findIndex((t) => t.id === Number(trainerId));
    if (idx === -1) return { success: false, message: 'Trainer not found' };
    const removed = this.trainers.splice(idx, 1)[0];
    return { success: true, removed, message: `${removed.name} removed from roster` };
  },

  // Add membership plan
  addMembershipPlan: function (plan) {
    const id = (plan.name || 'plan').toLowerCase().replace(/\s+/g, '-');
    const newPlan = { id, name: plan.name, monthlyPrice: Number(plan.monthlyPrice) };
    this.membershipPlans.push(newPlan);
    return newPlan;
  },

  updateMembershipPlanPrice: function (planId, newPrice) {
    const plan = this.membershipPlans.find((p) => p.id === planId);
    if (!plan) return { success: false, message: 'Plan not found' };
    plan.monthlyPrice = Number(newPrice);
    return { success: true, plan };
  },

  removeMembershipPlan: function (planId) {
    const idx = this.membershipPlans.findIndex((p) => p.id === planId);
    if (idx === -1) return { success: false, message: 'Plan not found' };
    this.membershipPlans.splice(idx, 1);
    return { success: true };
  },

  // Discount management
  addDiscount: function (data) {
    const newDiscount = {
      id: this.discounts.length + 1,
      code: data.code.toUpperCase(),
      type: data.type || 'percentage',
      amount: Number(data.amount),
      minOrder: Number(data.minOrder || 0),
      active: true,
      uses: 0,
      description: data.description || '',
    };
    this.discounts.push(newDiscount);
    return newDiscount;
  },

  toggleDiscount: function (id) {
    const d = this.discounts.find((x) => x.id === Number(id));
    if (!d) return { success: false };
    d.active = !d.active;
    return { success: true, discount: d };
  },

  removeDiscount: function (id) {
    const idx = this.discounts.findIndex((x) => x.id === Number(id));
    if (idx === -1) return { success: false };
    this.discounts.splice(idx, 1);
    return { success: true };
  },

  // Member memberships (freeze / cancel / renew / suspend)
  setMembershipStatus: function (memberId, status) {
    const record = this.memberMemberships.find((m) => m.memberId === Number(memberId));
    if (!record) return { success: false, message: 'Membership not found' };
    record.status = status;
    const user = this.getUserById(Number(memberId));
    if (user) user.membershipStatus = status;
    return { success: true, record };
  },

  renewMembership: function (memberId, months = 12) {
    const record = this.memberMemberships.find((m) => m.memberId === Number(memberId));
    if (!record) return { success: false, message: 'Membership not found' };
    const end = new Date(record.endDate);
    end.setMonth(end.getMonth() + Number(months));
    record.endDate = end.toISOString().slice(0, 10);
    record.status = 'active';
    return { success: true, record };
  },

  upgradeMembership: function (memberId, planId) {
    const record = this.memberMemberships.find((m) => m.memberId === Number(memberId));
    const plan = this.membershipPlans.find((p) => p.id === planId);
    if (!record || !plan) return { success: false, message: 'Membership or plan not found' };
    record.planId = plan.id;
    record.planName = plan.name;
    record.monthlyPrice = plan.monthlyPrice;
    const user = this.getUserById(Number(memberId));
    if (user) user.membershipTier = plan.name;
    return { success: true, record };
  },

  // Financial / payment methods
  refundPayment: function (paymentId) {
    const payment = this.payments.find((p) => p.id === Number(paymentId));
    if (!payment) return { success: false, message: 'Payment not found' };
    if (payment.status === 'refunded') return { success: false, message: 'Already refunded' };
    payment.status = 'refunded';
    return { success: true, payment };
  },

  recordCashPayment: function (data) {
    const member = this.getUserById(Number(data.memberId));
    const payment = {
      id: this.payments.length + 1,
      memberId: Number(data.memberId),
      memberName: member ? member.name : 'Walk-in',
      amount: Number(data.amount),
      method: 'cash',
      status: 'paid',
      paidAt: new Date().toISOString(),
      last4: 'CASH',
      description: data.description || 'Cash payment',
    };
    this.payments.push(payment);
    return { success: true, payment };
  },

  getRevenueSummary: function () {
    const paid = this.payments.filter((p) => p.status === 'paid');
    const refunded = this.payments.filter((p) => p.status === 'refunded');
    const totalRevenue = paid.reduce((s, p) => s + Number(p.amount || 0), 0);
    const totalRefunds = refunded.reduce((s, p) => s + Number(p.amount || 0), 0);
    return {
      totalRevenue,
      totalRefunds,
      netRevenue: totalRevenue - totalRefunds,
      transactionCount: paid.length,
      refundCount: refunded.length,
    };
  },

  // Roles / permissions
  changeUserRole: function (userId, newRole) {
    const user = this.getUserById(Number(userId));
    if (!user) return { success: false, message: 'User not found' };
    if (!['admin', 'manager', 'trainer', 'member'].includes(newRole)) {
      return { success: false, message: 'Invalid role' };
    }
    user.role = newRole;
    return { success: true, user };
  },

  assignTrainerToBranch: function (trainerId, branch) {
    const trainer = this.trainers.find((t) => t.id === Number(trainerId));
    if (!trainer) return { success: false, message: 'Trainer not found' };
    trainer.branch = branch;
    return { success: true, trainer };
  },

  // Member helpers
  registerMemberByStaff: function (data) {
    const newMember = {
      id: this.users.length + 1,
      name: data.name,
      email: data.email,
      username: data.username,
      password: data.password || 'TempPass1',
      role: 'member',
      avatar: '👤',
      membershipTier: data.tier || 'Starter',
      joiningDate: new Date().toISOString().slice(0, 10),
      totalBookings: 0,
      membershipStatus: 'active',
    };
    this.users.push(newMember);

    const plan = this.membershipPlans.find((p) => p.id === (data.tier || 'starter').toLowerCase());
    if (plan) {
      this.memberMemberships.push({
        id: this.memberMemberships.length + 1,
        memberId: newMember.id,
        memberName: newMember.name,
        planId: plan.id,
        planName: plan.name,
        status: 'active',
        startDate: newMember.joiningDate,
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
        monthlyPrice: plan.monthlyPrice,
        branch: data.branch || 'Maadi',
      });
    }
    return newMember;
  },

  updateMemberInfo: function (memberId, updates) {
    const user = this.getUserById(Number(memberId));
    if (!user) return { success: false, message: 'Member not found' };
    Object.assign(user, updates);
    return { success: true, user };
  },

  changeUserPassword: function (userId, currentPassword, newPassword) {
    const user = this.users.find((u) => u.id === Number(userId));
    if (!user) return { success: false, message: 'User not found' };
    if (user.password !== currentPassword) return { success: false, message: 'Current password is incorrect' };
    user.password = newPassword;
    return { success: true };
  },

  // Personal training
  createPersonalTrainingRequest: function (data) {
    const trainer = this.trainers.find((t) => t.id === Number(data.trainerId));
    const member = this.getUserById(Number(data.memberId));
    const request = {
      id: this.personalTrainingRequests.length + 1,
      memberId: Number(data.memberId),
      memberName: member ? member.name : 'Member',
      trainerId: Number(data.trainerId),
      trainerName: trainer ? trainer.name : 'Trainer',
      sessionType: data.sessionType,
      date: data.date,
      time: data.time,
      status: 'pending',
      notes: data.notes || '',
    };
    this.personalTrainingRequests.push(request);
    return request;
  },

  getMemberPersonalRequests: function (memberId) {
    return this.personalTrainingRequests.filter((r) => r.memberId === Number(memberId));
  },

  // Trainer: get members assigned via classes
  getTrainerMembers: function (trainerId) {
    const trainerClasses = this.classes.filter((c) => c.trainerId === Number(trainerId));
    const classIds = trainerClasses.map((c) => c.id);
    const bookingMemberIds = Array.from(new Set(this.bookings.filter((b) => classIds.includes(b.classId)).map((b) => b.memberId)));
    return bookingMemberIds.map((mid) => this.getUserById(mid)).filter(Boolean);
  },

  // Manager reports
  getDailyAttendance: function () {
    return this.attendance.map((a) => ({
      date: a.date,
      className: a.className,
      attended: a.attended,
      noShow: a.noShow,
      cancelled: a.cancelled,
      total: a.totalSpots,
    }));
  },

  getRenewalsThisMonth: function () {
    const now = new Date();
    return this.memberMemberships.filter((m) => {
      const end = new Date(m.endDate);
      return end.getMonth() === now.getMonth() && end.getFullYear() === now.getFullYear();
    });
  },

  // === SHOP PRODUCT CRUD (admin only) ===
  _loadProducts: function () {
    try {
      const raw = localStorage.getItem('powertemple_products');
      if (raw) this.products = JSON.parse(raw);
    } catch (e) { /* ignore */ }
  },

  _saveProducts: function () {
    try { localStorage.setItem('powertemple_products', JSON.stringify(this.products)); } catch (e) { /* ignore */ }
  },

  getAllProducts: function () {
    return this.products;
  },

  getProductById: function (id) {
    return this.products.find((p) => p.id === Number(id));
  },

  addProduct: function (data) {
    const newProduct = {
      id: this.products.length ? Math.max.apply(null, this.products.map((p) => p.id)) + 1 : 1,
      name: data.name,
      category: data.category,
      price: Number(data.price),
      unit: data.unit || '',
      badge: data.badge || '',
      image: data.image || '',
      description: data.description || '',
      stock: Number(data.stock || 0),
    };
    this.products.push(newProduct);
    this._saveProducts();
    return newProduct;
  },

  updateProduct: function (id, updates) {
    const p = this.getProductById(id);
    if (!p) return { success: false, message: 'Product not found' };
    ['name', 'category', 'price', 'unit', 'badge', 'image', 'description', 'stock'].forEach((k) => {
      if (updates[k] !== undefined) p[k] = (k === 'price' || k === 'stock') ? Number(updates[k]) : updates[k];
    });
    this._saveProducts();
    return { success: true, product: p };
  },

  removeProduct: function (id) {
    const idx = this.products.findIndex((p) => p.id === Number(id));
    if (idx === -1) return { success: false, message: 'Product not found' };
    const removed = this.products.splice(idx, 1)[0];
    this._saveProducts();
    return { success: true, removed };
  },
};

// Hydrate products from localStorage on load so admin edits persist across pages.
if (typeof PowerTempleAPI._loadProducts === 'function') PowerTempleAPI._loadProducts();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PowerTempleAPI;
}

