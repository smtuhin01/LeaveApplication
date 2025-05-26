const mongoose = require('mongoose');

// Define the LeaveApplication schema
const leaveApplicationSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  leaveType: {
    type: String,
    enum: ['Annual Leave', 'Medical Leave', 'Emergency Leave'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Create a compound index to prevent duplicates
leaveApplicationSchema.index(
  { employeeId: 1, startDate: 1, endDate: 1 },
  { unique: true }
);

// Create the LeaveApplication model
const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

module.exports = LeaveApplication; 