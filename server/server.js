const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

let messages = [];

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

let otps = {};
let otpTimestamps = {};

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

app.post('/api/messages/send', (req, res) => {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        return res.status(400).json({ error: 'Invalid message data' });
    }

    const message = {
        sender: senderId,
        receiver: receiverId,
        content,
        timestamp: new Date().toISOString(),
    };

    messages.push(message);
    return res.status(200).json(message);
});

app.get('/api/messages/chat/:userId1/:userId2', (req, res) => {
    const { userId1, userId2 } = req.params;

    const chatMessages = messages.filter(
        msg =>
            (msg.sender === userId1 && msg.receiver === userId2) ||
            (msg.sender === userId2 && msg.receiver === userId1)
    );

    return res.status(200).json(chatMessages);
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    const data = {
        model: "gpt-3.5-turbo-0125",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message }
        ]
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Make sure to set this in your .env file
            }
        });
        res.status(200).json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error communicating with OpenAI', error: error.response ? error.response.data : error.message });
    }
});

// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
