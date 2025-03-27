const nodemailer = require('nodemailer');
const axios = require('axios');
const { getEmailConfig, getWhatsAppConfig } = require('../firebase/dbConfig');

class OTPService {
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendEmailOTP(email, otp, companyId) {
    try {
        console.log("Attempting to send email OTP");
        const emailConfig = getEmailConfig(companyId);
        
        // Create transporter with more detailed configuration
        const transporter = nodemailer.createTransport({
            host: emailConfig.auth.host || 'smtp.gmail.com', // Default to Gmail SMTP
            port: emailConfig.auth.port || 587, // Default port for TLS
            secure: emailConfig.auth.secure || false, // true for 465, false for other ports
            service: emailConfig.auth.service,
            auth: {
                user: emailConfig.auth.user,
                pass: emailConfig.auth.pass
            },
            tls: {
                rejectUnauthorized: false // Helps avoid self-signed certificate issues
            }
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log("Transporter verified successfully");

        const info = await transporter.sendMail({
            from: emailConfig.auth.user,
            to: email,
            subject: 'Verification OTP',
            text: `Your OTP is: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Email Verification</h2>
                    <p>Your OTP for verification is:</p>
                    <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
                    <p>This OTP will expire soon. Please do not share this with anyone.</p>
                </div>
            `
        });

        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send email OTP: ${error.message}`);
    }
  }

  

  static async sendWhatsAppOTP(phone, otp, companyId) {
    const whatsappConfig = getWhatsAppConfig(companyId);
    
    try {
      await axios.post('https://api.wappie.in/v2/whatsapp/messages/sendDirectly', {
        from: whatsappConfig.fromNumber,
        to: '+91'+phone,
        type: "template",
        template: {
          name: whatsappConfig.templateName,
          language: {
            code: "en",
            policy: "deterministic"
          },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: otp }]
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: otp }]
            }
          ]
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': whatsappConfig.apiKey
        }
      });
    } catch (error) {
      throw new Error('Failed to send WhatsApp OTP: ' + error.message);
    }
  }
}

module.exports = OTPService; 