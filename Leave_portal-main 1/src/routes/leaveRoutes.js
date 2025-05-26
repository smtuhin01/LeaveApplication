const express = require('express');
const router = express.Router();
const LeaveApplication = require('../models/leaveApplication');
const { auth, checkHR } = require('../middleware/auth');

// Create a new leave application
router.post('/', async (req, res) => {
  try {
    const { employeeId, employeeName, leaveType, startDate, endDate } = req.body;

    if (!employeeId || !employeeName || !leaveType || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    const leave = await LeaveApplication.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Leave application already exists for these dates' });
    }
    console.error('Error creating leave application:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all leave applications (HR only)
router.get('/', auth, checkHR, async (req, res) => {
  try {
    const leaves = await LeaveApplication.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search leave applications (HR only)
router.get('/search', auth, checkHR, async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const query = {};

    if (employeeId) query.employeeId = employeeId;
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }

    const leaves = await LeaveApplication.find(query).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Error during leave search:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update leave status (HR only)
router.patch('/:id', auth, checkHR, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (Approved, Rejected, Pending)' });
    }

    const leave = await LeaveApplication.findById(id);

    if (!leave) {
      return res.status(404).json({ error: 'Leave application not found' });
    }

    leave.status = status;
    await leave.save();

    res.json({ message: 'Leave status updated', leave });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
