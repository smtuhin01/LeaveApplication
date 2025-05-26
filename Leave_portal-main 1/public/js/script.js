// DOM Elements
const leaveForm = document.getElementById('leaveForm');
const leaveTableBody = document.getElementById('leaveTableBody');

// API URL
const API_URL = 'http://localhost:3002/api/leave';

// Load leave applications on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLeaveApplications();
});

// Handle form submission
leaveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        employeeId: document.getElementById('employeeId').value,
        employeeName: document.getElementById('employeeName').value,
        leaveType: document.getElementById('leaveType').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit leave application');
        }

        // Clear form and show success message
        leaveForm.reset();
        alert('Leave application submitted successfully!');
        
        // Reload leave applications
        loadLeaveApplications();
    } catch (error) {
        alert(error.message);
    }
});

// Load all leave applications
async function loadLeaveApplications() {
    try {
        const response = await fetch(API_URL);
        const leaves = await response.json();
        displayLeaveApplications(leaves);
    } catch (error) {
        console.error('Error loading leave applications:', error);
    }
}

// Display leave applications in table
function displayLeaveApplications(leaves) {
    leaveTableBody.innerHTML = '';
    
    leaves.forEach(leave => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${leave.employeeId}</td>
            <td>${leave.employeeName}</td>
            <td>${leave.leaveType}</td>
            <td>${formatDate(leave.startDate)}</td>
            <td>${formatDate(leave.endDate)}</td>
            <td>${leave.status}</td>
        `;
        leaveTableBody.appendChild(row);
    });
}

// Search leave applications
async function searchLeaves() {
    const employeeId = document.getElementById('searchEmployeeId').value;
    const startDate = document.getElementById('searchStartDate').value;
    const endDate = document.getElementById('searchEndDate').value;

    let searchUrl = `${API_URL}/search?`;
    
    if (employeeId) searchUrl += `employeeId=${employeeId}&`;
    if (startDate && endDate) {
        searchUrl += `startDate=${startDate}&endDate=${endDate}`;
    }

    try {
        const response = await fetch(searchUrl);
        const leaves = await response.json();
        displayLeaveApplications(leaves);
    } catch (error) {
        console.error('Error searching leave applications:', error);
    }
}

// Format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
} 