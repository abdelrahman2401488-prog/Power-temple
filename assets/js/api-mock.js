/* =================================
   POWER TEMPLE - API MOCK DATABASE
   ================================= */

// Mock data structure simulating backend API
const PowerTempleAPI = {
  // === USERS DATA ===
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@powertemple.com',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      avatar: '👨‍💼',
    },
    {
      id: 2,
      name: 'Coach Maya',
      email: 'maya@powertemple.com',
      username: 'coach_maya',
      password: 'maya123',
      role: 'trainer',
      avatar: '👩‍🏫',
      specialty: 'Strength & Power',
      rating: 4.9,
      totalSessions: 187,
      retentionRate: 94,
    },
    {
      id: 3,
      name: 'Coach Daniel',
      email: 'daniel@powertemple.com',
      username: 'coach_daniel',
      password: 'daniel123',
      role: 'trainer',
      avatar: '👨‍🏫',
      specialty: 'Cardio & Conditioning',
      rating: 4.8,
      totalSessions: 165,
      retentionRate: 91,
    },
    {
      id: 4,
      name: 'Coach Sarah',
      email: 'sarah@powertemple.com',
      username: 'coach_sarah',
      password: 'sarah123',
      role: 'trainer',
      avatar: '👩‍🏫',
      specialty: 'Recovery & Mobility',
      rating: 4.9,
      totalSessions: 142,
      retentionRate: 96,
    },
    {
      id: 5,
      name: 'John Doe',
      email: 'john@email.com',
      username: 'john_doe',
      password: 'john123',
      role: 'member',
      avatar: '👨‍🦱',
      membershipTier: 'Elite',
      joiningDate: '2025-06-15',
      totalBookings: 24,
    },
    {
      id: 6,
      name: 'Jane Smith',
      email: 'jane@email.com',
      username: 'jane_smith',
      password: 'jane123',
      role: 'member',
      avatar: '👩‍🦰',
      membershipTier: 'Pro',
      joiningDate: '2025-08-20',
      totalBookings: 18,
    },
  ],

  // === TRAINERS DATA ===
  trainers: [
    {
      id: 1,
      name: 'Coach Maya',
      username: 'coach_maya',
      specialty: 'Strength & Power',
      rating: 4.9,
      sessionsPerWeek: 12,
      totalMembers: 45,
      status: 'active',
      bio: 'Olympic lifting specialist with 10+ years experience',
    },
    {
      id: 2,
      name: 'Coach Daniel',
      username: 'coach_daniel',
      specialty: 'Cardio & Conditioning',
      rating: 4.8,
      sessionsPerWeek: 9,
      totalMembers: 38,
      status: 'active',
      bio: 'HIIT certified trainer, passionate about cardio performance',
    },
    {
      id: 3,
      name: 'Coach Sarah',
      username: 'coach_sarah',
      specialty: 'Recovery & Mobility',
      rating: 4.9,
      sessionsPerWeek: 8,
      totalMembers: 32,
      status: 'active',
      bio: 'Yoga & mobility expert, helps members prevent injuries',
    },
    {
      id: 4,
      name: 'Coach James',
      username: 'coach_james',
      specialty: 'Combat Sports',
      rating: 4.7,
      sessionsPerWeek: 7,
      totalMembers: 28,
      status: 'active',
      bio: 'Boxing & kickboxing specialist, builds explosive power',
    },
    {
      id: 5,
      name: 'Coach Emma',
      username: 'coach_emma',
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
      name: 'Sunrise Power Blast',
      category: 'Cardio',
      level: 'Intermediate',
      trainer: 'Coach Maya',
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
      trainer: 'Coach Daniel',
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
      trainer: 'Coach Sarah',
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
      trainer: 'Coach James',
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
      trainer: 'Coach Emma',
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
      trainer: 'Coach Daniel',
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
    { id: 'starter', name: 'Starter', monthlyPrice: 19 },
    { id: 'elite', name: 'Elite', monthlyPrice: 59 },
    { id: 'pro', name: 'Pro', monthlyPrice: 89 },
    { id: 'champion', name: 'Champion', monthlyPrice: 149 },
  ],

  // === PAYMENT RECORDS ===
  payments: [],

  // === MEMBER BOOKINGS ===
  bookings: [
    {
      id: 1,
      memberId: 5,
      classId: 1,
      className: 'Sunrise Power Blast',
      trainer: 'Coach Maya',
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
      trainer: 'Coach Sarah',
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
      trainer: 'Coach James',
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
      trainer: 'Coach Daniel',
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
      className: 'Sunrise Power Blast',
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

    const classFee = 12;
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
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PowerTempleAPI;
}
