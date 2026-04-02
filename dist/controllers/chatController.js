import * as chatService from '../services/chatService.js';
export const sendMessage = async (req, res) => {
    try {
        const message = await chatService.saveMessage(req.body.sender_name, req.body.message);
        res.status(201).json(message);
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
};
export const getMessages = async (req, res) => {
    try {
        const messages = await chatService.getAllMessages();
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
export const replyMessage = async (req, res) => {
    try {
        const message = await chatService.replyToMessage(req.params.id, req.body.reply);
        res.json(message);
    }
    catch (error) {
        res.status(400).json({ error: 'Update failed' });
    }
};
