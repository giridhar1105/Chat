const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const axios = require('axios');
const WebSocket = require('ws');
const http = require('http'); // Add this line to import the http module
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// WebSocket server setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = {}; // Store rooms by ID
let clients = []; // Store WebSocket clients

// Function to create a unique room ID
const generateRoomId = (user1, user2) => {
    return user1 < user2 ? `${user1}:${user2}` : `${user2}:${user1}`;
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    let currentRoomId;
    let currentUserId;

    clients.push(ws);
    console.log('New client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'join':
                currentUserId = data.userId;
                currentRoomId = generateRoomId(data.userId1, data.userId2);

                // Add user to room
                if (!rooms[currentRoomId]) {
                    rooms[currentRoomId] = [];
                }
                rooms[currentRoomId].push(ws);

                ws.send(JSON.stringify({ type: 'joined', roomId: currentRoomId }));
                break;

            case 'message':
                // Broadcast the message to all clients in the room
                if (currentRoomId) {
                    const messageData = {
                        type: 'message',
                        sender: currentUserId,
                        content: data.content,
                    };
                    rooms[currentRoomId].forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(messageData));
                        }
                    });
                }
                break;

            case 'leave':
                // Remove user from room
                if (currentRoomId && rooms[currentRoomId]) {
                    rooms[currentRoomId] = rooms[currentRoomId].filter(client => client !== ws);
                    if (rooms[currentRoomId].length === 0) {
                        delete rooms[currentRoomId];
                    }
                }
                break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client !== ws);
        
        if (currentRoomId && rooms[currentRoomId]) {
            rooms[currentRoomId] = rooms[currentRoomId].filter(client => client !== ws);
            if (rooms[currentRoomId].length === 0) {
                delete rooms[currentRoomId];
            }
        }
    });
});

// API routes
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

    // Broadcast message to WebSocket clients
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });

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
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        res.status(200).json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error communicating with OpenAI', error: error.response ? error.response.data : error.message });
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
