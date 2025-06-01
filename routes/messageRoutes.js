const express = require('express');
const { addMessage, deleteMessage , getMessages} = require('../controllers/messageController');

const router = express.Router();

router.post('/create', addMessage); // no auth
router.get('/', getMessages);
router.delete('/:id', deleteMessage);

module.exports = router;
