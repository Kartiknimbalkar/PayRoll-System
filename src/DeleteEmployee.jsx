// src/components/DeleteEmployee.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const DeleteEmployee = () => {
  const [employeeId, setEmployeeId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    if (!employeeId) return
    setLoading(true)
    axios
      .delete(
        `http://localhost:8091/employee-service/api/employee/delete/${employeeId}`
      )
      .then(() => {
        setMessage('Employee deleted successfully.')
        setTimeout(() => navigate('/employees'), 1000)
      })
      .catch(() => setMessage('Failed to delete.'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Delete Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Employee ID</label>
          <input
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          {loading ? 'Deleting…' : 'Delete Employee'}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  )
}

export default DeleteEmployee
