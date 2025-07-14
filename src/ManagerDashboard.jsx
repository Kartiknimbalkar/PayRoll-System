// src/components/ManagerDashboard.js
import React from 'react'
import { Link } from 'react-router-dom'

const ManagerDashboard = () => {
  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">HR Dashboard</h2>
      <div className="flex flex-col gap-6 items-center">
        <Link
          to="/employees"
          className="w-full text-center bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          👥 View Employees
        </Link>
        <Link
          to="/leave-approval"
          className="w-full text-center bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          📝 Approve/Reject Leaves
        </Link>
        <Link
          to="/update-employee"
          className="w-full text-center bg-yellow-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition"
        >
          ✏️ Update Employee
        </Link>
        <Link
          to="/delete-employee"
          className="w-full text-center bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition"
        >
          🗑️ Delete Employee
        </Link>
      </div>
    </div>
  )
}

export default ManagerDashboard
