// controllers/leaveController.js
const Leave = require('../models/Leave');

exports.applyLeave = async (req, res) => {
  try {

    const { startDate, endDate, reason } = req.body;
    const userid = req.user; // coming from protect middleware

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: 'Start date cannot be after end date' });
    }

    const leave = await Leave.create({
      employee: userid,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (err) {
    console.error('error leave', err);

    res.status(400).json({ error: 'Leave application failed' });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const { employeeId, fromDate, toDate } = req.query;

    // Base filter
    let filter = {};

    // if (req.user.role === 'employee') {
    //   filter.employee = req.user.id;
    // } else {
    // Admin or Manager can filter by employee, date range
    if (employeeId) filter.employee = employeeId;
    if (fromDate || toDate) {
      filter.startDate = {};
      if (fromDate) filter.startDate.$gte = new Date(fromDate);
      if (toDate) filter.startDate.$lte = new Date(toDate);
    }
    // }

    const leaves = await Leave.find(filter)
      .populate('employee', 'name email mobile aadhar role')
      .sort({ appliedAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('employee', 'name email mobile aadhar role');

    if (!leave) {
      return res.status(404).json({ error: 'Leave not found' });
    }

    res.json({ message: 'Leave status updated', leave });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update leave status' });
  }
};

// Delete a user
exports.deleteLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const deletedLeave = await Leave.findByIdAndDelete(leaveId);

    if (!deletedLeave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.json({ message: 'Leave deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

