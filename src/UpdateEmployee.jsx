// src/components/UpdateEmployee.js
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const UpdateEmployee = () => {
  const { id: routeId } = useParams()
  const navigate = useNavigate()

  // form state
  const [form, setForm] = useState({
    employeeId: routeId || '',
    name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    designation: '',
    bankName: '',
    accountNo: '',
    salaryStructure: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // If an :id param is present, fetch that employee’s data
  useEffect(() => {
    if (routeId) {
      setLoading(true)
      axios
        .get(`http://localhost:8091/employee-service/api/employee/get/${routeId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => setForm(res.data))
        .catch(err => setMessage('Error fetching employee'))
        .finally(() => setLoading(false))
    }
  }, [routeId])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    axios
      .put(
        `http://localhost:8091/employee-service/api/employee/update/${form.employeeId}`,
        form, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
      )
      .then(() => {
        setMessage('Employee updated successfully!')
        // optionally redirect back to list
        setTimeout(() => navigate('/employees'), 1000)
      })
      .catch(err => setMessage('Failed to update'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Update Employee</h2>

      {/* If no routeId, ask for an ID first */}
      {!routeId && (
        <form
          onSubmit={e => {
            e.preventDefault()
            navigate(`/update-employee/${form.employeeId}`)
          }}
          className="space-y-4 mb-8"
        >
          <div>
            <label className="block mb-1">Employee ID</label>
            <input
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Load Employee
          </button>
        </form>
      )}

      {/* Once ID is set, show full edit form */}
      {routeId && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'role', 'phone', 'department', 'designation', 'bankName', 'accountNo', 'salaryStructure'].map(field => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field}</label>
              <input
                name={field}
                value={form[field] || ''}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            {loading ? 'Updating…' : 'Update Employee'}
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  )
}

export default UpdateEmployee
