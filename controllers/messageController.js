// controllers/messageController.js
const Message = require('../models/Message');

exports.addMessage = async (req, res) => {
  try {

    const { message } = req.body;

    const messageReq = await Message.create({
      message,
    });

    res.status(201).json({ message: 'Message applied successfully', messageReq });
  } catch (err) {
    console.error('error message', err);

    res.status(400).json({ error: 'Message application failed' });
  }
};


// Get all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

