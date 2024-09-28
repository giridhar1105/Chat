const express = require('express');
const Message = require('./models/Messages');
const router = express.Router();

// Send a message
router.post('/send', async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    const message = new Message({ senderId, receiverId, content });
    try {
        await message.save();
        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        res.status(400).json({ message: 'Error sending message' });
    }
});

// Get messages between two users
router.get('/chat/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages' });
    }
});

module.exports = router;
