/* =================================
   POWER TEMPLE - AUTHENTICATION SYSTEM
   ================================= */

class PowerTempleAuth {
  constructor() {
    this.currentUser = this.loadFromLocalStorage();
  }

  // Validation methods
  validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePasswordStrength(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  validateCardNumber(cardNumber) {
    // Remove spaces and check if it's 13-19 digits
    const cleaned = cardNumber.replace(/\s+/g, '');
    const cardRegex = /^\d{13,19}$/;
    return cardRegex.test(cleaned);
  }

  validateCardExpiry(expiry) {
    // MM/YY format
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) return false;

    const [month, year] = expiry.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    return true;
  }

  validateCVV(cvv) {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
  }

  validateDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date instanceof Date && !isNaN(date) && date > new Date();
  }

  validateCapacity(capacity) {
    const num = parseInt(capacity);
    return !isNaN(num) && num > 0 && num <= 100;
  }

  validateRequired(value) {
    return value && value.trim().length > 0;
  }

  validateCardHolderName(name) {
    // Must contain at least first and last name, letters and spaces only
    const nameRegex = /^[a-zA-Z\s]+$/;
    const trimmed = name.trim();
    const parts = trimmed.split(/\s+/);
    return nameRegex.test(trimmed) && parts.length >= 2 && trimmed.length >= 3;
  }
  getAppPath(targetPath) {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const isNested = /(\/admin\/|\/member\/|\/trainer\/|\/auth\/)/.test(path);
    return `${isNested ? '../' : ''}${targetPath}`;
  }

  // Load user from localStorage
  loadFromLocalStorage() {
    const stored = localStorage.getItem('powertemple_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading user:', e);
        return null;
      }
    }
    return null;
  }

  // Save user to localStorage
  saveToLocalStorage(user) {
    localStorage.setItem('powertemple_user', JSON.stringify(user));
  }

  // Login user
  login(identifier, password, selectedRole = null) {
    const user = PowerTempleAPI.findUser(identifier, password);

    if (!user) {
      return {
        success: false,
        message: 'Invalid username/email or password',
      };
    }

    if (selectedRole && user.role !== selectedRole) {
      return {
        success: false,
        message: `This account is ${user.role}. Please select the correct account type.`,
      };
    }

    // Remove password from stored user
    const userToStore = { ...user };
    delete userToStore.password;

    this.currentUser = userToStore;
    this.saveToLocalStorage(userToStore);

    return {
      success: true,
      user: userToStore,
      message: 'Login successful!',
    };
  }

  // Register new user
  register(fullName, email, username, password) {
    // Validation
    if (!fullName || !email || !username || !password) {
      return {
        success: false,
        message: 'All fields are required',
      };
    }

    if (email.includes('@') === false) {
      return {
        success: false,
        message: 'Invalid email address',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters',
      };
    }

    if (PowerTempleAPI.emailExists(email)) {
      return {
        success: false,
        message: 'Email already registered',
      };
    }

    // Create new user
    const newUser = PowerTempleAPI.registerUser({
      name: fullName,
      email,
      username,
      password,
    });

    const userToStore = { ...newUser };
    delete userToStore.password;

    this.currentUser = userToStore;
    this.saveToLocalStorage(userToStore);

    return {
      success: true,
      user: userToStore,
      message: 'Registration successful!',
    };
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('powertemple_user');
    return { success: true, message: 'Logged out successfully' };
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get current user role
  getUserRole() {
    return this.currentUser ? this.currentUser.role : null;
  }

  // Check if current user has specific role
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  // Protect route - redirect if not authenticated or wrong role
  protectRoute(requiredRoles = []) {
    if (!this.isAuthenticated()) {
      window.location.href = this.getAppPath('indexxx.html#login');
      return false;
    }

    if (requiredRoles.length > 0) {
      if (!requiredRoles.includes(this.getUserRole())) {
        this.redirectToDashboard();
        return false;
      }
    }

    return true;
  }

  // Redirect to appropriate dashboard based on role
  redirectToDashboard() {
    const role = this.getUserRole();

    switch (role) {
      case 'admin':
        window.location.href = this.getAppPath('admin/dashboard.html');
        break;
      case 'trainer':
        window.location.href = this.getAppPath('trainer/my-schedule.html');
        break;
      case 'member':
        window.location.href = this.getAppPath('member/browse-classes.html');
        break;
      default:
        window.location.href = this.getAppPath('indexxx.html');
    }
  }

  // Quick fill demo accounts
  fillDemoAccount(role) {
    const demoAccounts = {
      member: { username: 'john_doe', password: 'john123' },
      trainer: { username: 'coach_maya', password: 'maya123' },
      admin: { username: 'admin', password: 'admin123' },
    };

    const demo = demoAccounts[role];
    if (demo) {
      document.getElementById('loginUsername').value = demo.username;
      document.getElementById('loginPassword').value = demo.password;
    }
  }
}

// Initialize auth system
const auth = new PowerTempleAuth();

// Page load protection - check role access
document.addEventListener('DOMContentLoaded', function () {
  const page = document.body.getAttribute('data-page');
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();

  // Route protection by URL path is more reliable than page flags.
  if (/\/admin\//.test(path)) {
    auth.protectRoute(['admin']);
  } else if (/\/trainer\//.test(path)) {
    auth.protectRoute(['trainer']);
  } else if (/\/member\//.test(path)) {
    const isPublicClassesPage = /\/member\/browse-classes\.html$/.test(path);
    if (!isPublicClassesPage) {
      auth.protectRoute(['member']);
    }
  } else if (page === 'admin') {
    auth.protectRoute(['admin']);
  } else if (page === 'trainer') {
    auth.protectRoute(['trainer']);
  } else if (page === 'member') {
    auth.protectRoute(['member']);
  }

  // Update navbar if user is logged in
  updateNavbarUser();
});

// Update navbar with user info
function updateNavbarUser() {
  const user = auth.getCurrentUser();
  if (user) {
    const userElement = document.querySelector('.nav-user');
    if (userElement) {
      userElement.innerHTML = `
        <span>${user.name}</span>
        <button onclick="auth.logout(); window.location.href='${auth.getAppPath('indexxx.html')}';" class="btn btn-ghost" style="font-size: 0.9rem;">
          Logout
        </button>
      `;
    }
  }
}

// Show notification messages
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notice ${type}`;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '400px';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, duration);
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const identifier = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const selectedRole = document.getElementById('loginRole')?.value || null;

      const result = auth.login(identifier, password, selectedRole);

      if (result.success) {
        showNotification(result.message, 'success', 1500);
        setTimeout(() => {
          auth.redirectToDashboard();
        }, 500);
      } else {
        showNotification(result.message, 'error');
      }
    });
  }

  // Handle register form submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const username = document.getElementById('registerUsername').value.trim();
      const password = document.getElementById('registerPassword').value.trim();
      const confirmPassword = document.getElementById('registerConfirm').value.trim();

      if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
      }

      const result = auth.register(fullName, email, username, password);

      if (result.success) {
        showNotification(result.message, 'success', 1500);
        setTimeout(() => {
          auth.redirectToDashboard();
        }, 500);
      } else {
        showNotification(result.message, 'error');
      }
    });
  }
});

// Demo account quick fill buttons
document.addEventListener('DOMContentLoaded', function () {
  const demoButtons = document.querySelectorAll('[data-demo]');
  demoButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const role = this.getAttribute('data-demo');
      auth.fillDemoAccount(role);
    });
  });
});
