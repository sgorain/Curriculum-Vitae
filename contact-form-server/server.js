// Loads the 'express' package to create a web server
const express = require('express');
// Loads 'nodemailer' to send emails
const nodemailer = require('nodemailer');
// Loads 'path' to handle file paths (like finding the 'public' folder)
const path = require('path');
// Loads 'dotenv' to read the .env file for secrets (like email password)
require('dotenv').config();


// Creates an Express app (our server)
const app = express();
// Sets the port number where the server will run (3000 is common for testing)
const port = 3000;

// Tells Express to serve files from the 'public' folder (like contact.html)
app.use(express.static(path.join(__dirname, 'public')));
// Helps Express understand form data sent from the webpage
app.use(express.urlencoded({ extended: true }));

// Sets up what happens when the form sends data to '/send'
app.post('/send', (req, res) => {
    // Pulls 'email' and 'message' from the form data
    const { email, message } = req.body;

    // Creates a tool to send emails using Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Uses Gmail to send emails
        auth: {
            user: process.env.EMAIL,    // Your email from .env
            pass: process.env.PASSWORD  // Your password from .env
        }
    });

    // Defines the email details
    const mailOptions = {
        from: process.env.EMAIL,     // Sender (your email)
        to: process.env.EMAIL,       // Receiver (your inbox)
        subject: `New Message from ${email}`, // Email subject line
        text: `Email: ${email}\nMessage: ${message}`, // Email body
        replyTo: email               // Lets you reply directly to the user
    };

    // Sends the email and handles success or failure
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) { // If something goes wrong
            console.log(error); // Shows the error in your terminal
            res.redirect('/contact.html?status=error'); // Sends user back with error status
        } else { // If it works
            console.log('Email sent: ' + info.response); // Confirms in terminal
            res.redirect('/contact.html?status=success'); // Sends user back with success status
        }
    });
});
// Starts the server and shows a message when it’s running
app.listen(port, () => {
    console.log(__dirname);
    console.log(`Server running at http://localhost:${port}`);
});