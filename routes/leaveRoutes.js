// routes/leaveRoutes.js
const express = require('express');
const {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  deleteLeave
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/', protect, getLeaves); // Employees see their leaves; Admin/Manager see all with filters
router.delete('/delete/:id', protect, authorize('manager', 'admin'), deleteLeave);
router.put('/:id', protect, authorize('manager', 'admin'), updateLeaveStatus);


module.exports = router;
