const express = require('express');
const { createUser, getUsers, deleteUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.post('/create', createUser); // no auth
router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

module.exports = router;
