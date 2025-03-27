const Razorpay = require("razorpay");
const crypto = require("crypto");
const { getRazorpayConfig } = require("../../firebase/dbConfig");

class RazorpayService {
  constructor() {
    this.instances = {};
  }

  getInstance(companyId) {
    // Return existing instance if already created
    if (this.instances[companyId]) {
      return this.instances[companyId];
    }

    // Get company-specific Razorpay config
    const config = getRazorpayConfig(companyId);
    
    // Create new instance
    const instance = new Razorpay({
      key_id: config.key_id,
      key_secret: config.key_secret
    });

    // Cache instance
    this.instances[companyId] = instance;
    
    return instance;
  }

  async createPaymentOrder(amount, receiptId, companyId) {
    try {
      const instance = this.getInstance(companyId);

      const options = {
        amount: amount * 100, 
        currency: "INR",
        receipt: receiptId
      };
      
      const order = await instance.orders.create(options);
      return order;
    } catch (error) {
      throw new Error("Error creating Razorpay order: " + error.message);
    }
  }

  verifyPaymentSignature({ order_id, payment_id, signature }, companyId) {
    const config = getRazorpayConfig(companyId);
    
    const generatedSignature = crypto
      .createHmac("sha256", config.key_secret)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    return generatedSignature === signature;
  }
}

module.exports = new RazorpayService();
