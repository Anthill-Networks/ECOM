const UserRepository = require('../../repos/user');
const { getDbConnection } = require('../../firebase/dbConfig');
const { v4: uuidv4 } = require('uuid');

class UserService {
  constructor() {
    this.userRepo = null;
  }

  // Initialize repository with correct database connection
  initializeRepo(companyId) {
    const dbConnection = getDbConnection(companyId);
    this.userRepo = new UserRepository(dbConnection);
  }

  async createUser(data) {
    this.initializeRepo(data.company_id);
    data.id = uuidv4();
    const result = await this.userRepo.createUser(data);
    return result;
  }

  async getUserById(id, companyId) {
    this.initializeRepo(companyId);
    const result = await this.userRepo.getUserById(id);
    return result;
  }

  async getUserByEmail(email, companyId) {
    this.initializeRepo(companyId);
    const result = await this.userRepo.getUserByEmail(email);
    return result;
  }

  async getUserByPhone(phone, companyId) {
    this.initializeRepo(companyId);
    const result = await this.userRepo.getUserByPhone(phone);
    return result;
  }

  async getAllUsers(query) {
    this.initializeRepo(query.company_id);
    const result = await this.userRepo.getAllUsers(query);
    return result;
  }

  async updateUser(id, data, companyId) {
    this.initializeRepo(companyId);
    const result = await this.userRepo.updateUser(id, data);
    return result;
  }

  async deleteUser(id, companyId) {
    this.initializeRepo(companyId);
    const result = await this.userRepo.deleteUser(id);
    return result;
  }

  async saveOTP(phone, otp, companyId) {
    this.initializeRepo(companyId);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes
    
    return await this.userRepo.saveOTP({
      phone,
      otp,
      expiresAt,
      verified: false,
      attempts: 0,
      purpose: 'verification'
    });
  }

  async verifyOTP(phone, otp, companyId) {
    this.initializeRepo(companyId);
    const storedOTP = await this.userRepo.getOTP(phone);
    console.log(storedOTP);
    
    if (!storedOTP) return false;
    if (storedOTP.attempts >= 3) return false;
    
    // Increment attempts
    await this.userRepo.incrementOTPAttempts(phone);
    
    if (storedOTP.otp != otp) return false;
    
    // Mark as verified if successful
    await this.userRepo.markOTPVerified(phone);
    return true;
  }

  async saveEmailOTP(email, otp, companyId, purpose = 'verification') {
    this.initializeRepo(companyId);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    return await this.userRepo.saveEmailOTP({
      email,
      otp,
      expiresAt,
      verified: false,
      attempts: 0,
      purpose
    });
  }

  async verifyEmailOTP(email, otp, companyId) {
    this.initializeRepo(companyId);
    const storedOTP = await this.userRepo.getEmailOTP(email);
    
    if (!storedOTP) return false;
    if (storedOTP.attempts >= 3) return false;
    
    // Increment attempts
    await this.userRepo.incrementEmailOTPAttempts(email);
    if (storedOTP.otp !== otp) return false;
    // Mark as verified if successful
    await this.userRepo.markEmailOTPVerified(email);
    return true;
  }

  async markPhoneAsVerified(phone, companyId) {
    this.initializeRepo(companyId);
    return await this.userRepo.updateUserByPhone(phone, { phone_verified: true });
  }

  async markEmailAsVerified(email, companyId) {
    this.initializeRepo(companyId);
    return await this.userRepo.updateUserByEmail(email, { email_verified: true });
  }
}

module.exports = new UserService();
