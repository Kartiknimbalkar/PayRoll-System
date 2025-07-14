import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch all pending leaves
  const fetchLeaves = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/attendance/leaves/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setLeaves(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch all leaves (any status)
  const fetchAllLeaves = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/attendance/leaves/getAll", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setAllLeaves(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
    fetchAllLeaves();
  }, []);

  // Approve or reject leave
  const handleAction = async (leaveId, action) => {
    try {
      await axios.post(
        `http://localhost:8080/api/attendance/leave/${leaveId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setLeaves((prev) => prev.filter((l) => l.leaveId !== leaveId));
      setFeedback({
        type: action === "approve" ? "success" : "danger",
        message:
          action === "approve"
            ? "🎉 Leave approved successfully! The employee will be notified."
            : "❌ Leave rejected. The employee has been informed."
      });
      setTimeout(() => {
        setFeedback(null);
        fetchLeaves();
        fetchAllLeaves();
      }, 3000);
    } catch {
      alert(`Failed to ${action} leave!`);
      console.error(`Error ${action}ing leave with ID ${leaveId}`);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading leave requests...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        {showAll ? "All Leave Requests" : "Pending Leave Requests"}
      </h2>
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg font-semibold border ${!showAll ? "bg-blue-600 text-white" : "bg-gray-100 text-blue-700"}`}
          onClick={() => setShowAll(false)}
        >
          Pending Only
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg font-semibold border ${showAll ? "bg-blue-600 text-white" : "bg-gray-100 text-blue-700"}`}
          onClick={() => setShowAll(true)}
        >
          All Leaves
        </button>
      </div>
      {feedback && (
        <div
          className={`mb-4 px-4 py-3 rounded text-center font-semibold transition-all ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300 animate-bounce"
              : "bg-red-100 text-red-800 border border-red-300 animate-pulse"
          }`}
        >
          {feedback.message}
        </div>
      )}
      {!showAll ? (
        leaves.length === 0 ? (
          <div className="text-center text-gray-500">No pending leave requests.</div>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-blue-50">
                  <td className="p-2 border">{leave.employeeId}</td>
                  <td className="p-2 border">{leave.date}</td>
                  <td className="p-2 border">{leave.leaveType}</td>
                  <td className="p-2 border">{leave.reason}</td>
                  <td className="p-2 border flex gap-2 justify-center">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      onClick={() => handleAction(leave.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => handleAction(leave.id, "reject")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        allLeaves.length === 0 ? (
          <div className="text-center text-gray-500">No leave records found.</div>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {allLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-blue-50">
                  <td className="p-2 border">{leave.employeeId}</td>
                  <td className="p-2 border">{leave.date}</td>
                  <td className="p-2 border">{leave.leaveType}</td>
                  <td className="p-2 border">{leave.reason}</td>
                  <td className="p-2 border">
                    <span className={
                      leave.status === "APPROVED"
                        ? "text-green-700 font-bold"
                        : leave.status === "REJECTED"
                        ? "text-red-700 font-bold"
                        : "text-yellow-700 font-bold"
                    }>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}