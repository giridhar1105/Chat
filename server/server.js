const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const OpenAI = require('openai'); // Import the OpenAI SDK
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

let otps = {};
let otpTimestamps = {};

// Function to generate OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
    const { email } = req.body;

    const otp = generateOtp();
    otps[email] = otp;
    otpTimestamps[email] = Date.now();

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    }, (error) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to send OTP', error });
        }
        res.status(200).json({ message: 'OTP sent successfully' });
    });
});

// Create an instance of OpenAI with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to handle AI chat messages using OpenAI SDK
app.post('/api/message', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message cannot be empty." });
    }

    try {
        // Call OpenAI API using the SDK
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: message }
            ]
        });

        const aiResponse = completion.choices[0].message.content;
        return res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return res.status(500).json({ error: 'Error fetching AI response.' });
    }
});

// Routes for authentication and messaging
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
