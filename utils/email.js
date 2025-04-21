const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP Configuration Error:', error);
    } else {
        console.log('✅ Email server is ready');
    }
});

const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: {
                name: 'TrustLedger Bank',
                address: process.env.EMAIL_FROM
            },
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || options.message
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email error:', error);
        throw new Error('Email service is temporarily unavailable');
    }
};

module.exports = sendEmail;