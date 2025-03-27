class UserRepository {
    constructor(db) {
      this.db = db;
      this.collection = this.db.collection('users');
      this.otpCollection = this.db.collection('otps');
      this.emailOtpCollection = this.db.collection('email_otps');
    }

    static getCurrentISODate() {
      return new Date().toISOString();
    }
  
  
    async createUser(data) {
      data.createdAt = UserRepository.getCurrentISODate();
      data.updatedAt = UserRepository.getCurrentISODate();
      const { id } = data;

      // Use a batch write to improve performance
      const batch = this.db.batch();
      const companyRef = this.collection.doc(id);
      batch.set(companyRef, data);
      await batch.commit();
      return { id, ...data };
    }


    async getUserByEmail(email) {
      const snapshot = await this.collection.where('email', '==', email).get();
      if (snapshot.empty) {
        return null;
      }
      let user = null;
      snapshot.forEach(doc => {
        user = { id: doc.id, ...doc.data() };
      });
      return user;
    }

    //get user by phone
    async getUserByPhone(phone) {
      const snapshot = await this.collection.where('phone', '==', phone).get();
      if (snapshot.empty) {
        return null;
      } 
      let user = null;
      snapshot.forEach(doc => {
        user = { id: doc.id, ...doc.data() };
      });
   
      return user;
    }
  
    async getUserById(id) {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('User not found');
      }
    }
  
    async getAllUsers(query) {
  
      let ref = this.collection

      // Apply filters based on query parameters
      if (query.role) {
        ref = ref.where('role', '==', query.role);
      }

      //companu id
      if (query.company_id) {
        ref = ref.where('company_id', '==', query.company_id);
      }
      
      const snapshot = await ref.get();
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
  
      return users;
    }
  
    async updateUser(id, data) {
      data.updated_at = new Date();
      const docRef = this.collection.doc(id);
      await docRef.update(data);
      const updatedUser = await docRef.get();
      return { id: updatedUser.id, ...updatedUser.data() };
    }
  
    async deleteUser(id) {
      const docRef = this.collection.doc(id);
      await docRef.delete();
      return { id, message: 'User deleted successfully' };
    }

    // OTP related methods
    async saveOTP(data) {
      const { phone } = data;
      const otpRef = this.otpCollection.doc(phone);
      await otpRef.set({
        ...data,
        createdAt: UserRepository.getCurrentISODate(),
        updatedAt: UserRepository.getCurrentISODate()
      });
      return data;
    }

    async saveEmailOTP(data) {
      const { email } = data;
      const otpRef = this.emailOtpCollection.doc(email);
      await otpRef.set({
        ...data,
        createdAt: UserRepository.getCurrentISODate(),
        updatedAt: UserRepository.getCurrentISODate()
      });
      return data;
    }

    async getOTP(phone) {
      const otpRef = this.otpCollection.doc(phone);
      const doc = await otpRef.get();
      if (!doc.exists) return null;
      return doc.data();
    }

    async getEmailOTP(email) {
      const otpRef = this.emailOtpCollection.doc(email);
      const doc = await otpRef.get();
      if (!doc.exists) return null;
      return doc.data();
    }

    async incrementOTPAttempts(phone) {
      const otpRef = this.otpCollection.doc(phone);
      const doc = await otpRef.get();
      await otpRef.update({
        attempts: doc.data().attempts + 1,
        updatedAt: UserRepository.getCurrentISODate()
      });
    }

    async incrementEmailOTPAttempts(email) {
      const otpRef = this.emailOtpCollection.doc(email);
      const doc = await otpRef.get();
      await otpRef.update({
        attempts: doc.data().attempts + 1,
        updatedAt: UserRepository.getCurrentISODate()
      });
    }

    async markOTPVerified(phone) {
      const otpRef = this.otpCollection.doc(phone);
      await otpRef.update({
        verified: true,
        updatedAt: UserRepository.getCurrentISODate()
      });
    }

    async markEmailOTPVerified(email) {
      const otpRef = this.emailOtpCollection.doc(email);
      await otpRef.update({
        verified: true,
        updatedAt: UserRepository.getCurrentISODate()
      });
    }

    async updateUserByPhone(phone, data) {
      const snapshot = await this.collection.where('phone', '==', phone).get();
      if (snapshot.empty) {
        throw new Error('User not found');
      }
      
      const userDoc = snapshot.docs[0];
      await userDoc.ref.update({
        ...data,
        updatedAt: UserRepository.getCurrentISODate()
      });
      
      const updatedDoc = await userDoc.ref.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    }

    async verifyOTP(phone, otp) {
      const snapshot = await this.collection.where('phone', '==', phone).get();
      if (snapshot.empty) {
        return null;
      }
    }

    async updateUserByEmail(email, data) {
      const snapshot = await this.collection.where('email', '==', email).get();
      if (snapshot.empty) {
        throw new Error('User not found');
      }
      
      const userDoc = snapshot.docs[0];
      await userDoc.ref.update({
        ...data,
        updatedAt: UserRepository.getCurrentISODate()
      });
      
      const updatedDoc = await userDoc.ref.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    }

    // Helper method to clean up expired OTPs (can be run periodically)
    async cleanupExpiredOTPs() {
      const now = new Date();
      
      // Clean phone OTPs
      const expiredPhoneOTPs = await this.otpCollection
        .where('expiresAt', '<', now)
        .get();
      
      expiredPhoneOTPs.forEach(async (doc) => {
        await doc.ref.delete();
      });

      // Clean email OTPs
      const expiredEmailOTPs = await this.emailOtpCollection
        .where('expiresAt', '<', now)
        .get();
      
      expiredEmailOTPs.forEach(async (doc) => {
        await doc.ref.delete();
      });
    }
}
  
  module.exports = UserRepository;
  