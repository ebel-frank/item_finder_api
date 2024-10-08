const nodemailer = require('nodemailer');
const express = require('express')
const router = express.Router()


// Set up the transporter for Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'businessrevolutionaries@gmail.com',
        pass: 'zihxxnluoxvlytwl',  // Use an app-specific password if using Gmail
    },
});

// API endpoint to send an email
router.post('/api/alert-contacts', (req, res) => {
    const { e_email, e_name, user_name, e_relshp, lat, long } = req.body;

    // Define the email options
    const mailOptions = {
        from: 'businessrevolutionaries@gmail.com',  // Sender address
        to: e_email,  // Recipient's email address (from request body)
        subject: "URGENT: EMERGENCY ALERT",
        text: `Hello ${e_name},

This is an emergency. ${user_name} is in immediate danger and has shared their current location with you. As their ${e_relshp}, your prompt action could be critical. Please reach out or seek help immediately.

Location: https://maps.google.com/?q=${lat},${long}.

Please act immediately.`
    };

    // Send the email using Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email', error });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});

module.exports = router