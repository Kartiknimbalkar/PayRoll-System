import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const payslipMonths = ["2025-06", "2025-05"]; // Replace with dynamic months if available

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [workSummary, setWorkSummary] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Leave application states
  const [leaveType, setLeaveType] = useState("CASUAL");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveMsg, setLeaveMsg] = useState("");
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  // Change password states
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  const navigate = useNavigate();

  // Fetch employee details (full profile)
  useEffect(() => {
    const role = localStorage.getItem("role");
    const employeeId = localStorage.getItem("employeeId");
    const token = localStorage.getItem("token");
    if (role === "EMPLOYEE" && employeeId && token) {
      axios
        .get(
          `http://localhost:8091/employee-service/api/employee/get/${employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setEmployee(res.data);
          setLoading(false);
        })
        .catch(() => {
          setEmployee(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch work summary and leave history when employee is loaded or leave is applied
  useEffect(() => {
    if (!employee) return;
    const fetchData = async () => {
      try {
        // Work summary (total hours, overtime)
        const wsRes = await axios.get(
          `http://localhost:8080/api/attendance/total-hours/${employee.employeeId}`
        );
        setWorkSummary(wsRes.data);

        // Leave history
        const leaveRes = await axios.get(
          `http://localhost:8080/api/attendance/leaveHistory/${employee.employeeId}`
        );
        setLeaveHistory(leaveRes.data || []);
      } catch (err) {
        setWorkSummary(null);
        setLeaveHistory([]);
      }
    };
    fetchData();
  }, [employee, leaveMsg]);

  // Handler for leave application
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setLeaveMsg("");
    try {
      await axios.post(
        "http://localhost:8080/api/attendance/applyLeave",
        null,
        {
          params: {
            employeeId: employee.employeeId,
            date: leaveDate,
            leaveType,
            reason: leaveReason,
          },
        }
      );
      setLeaveMsg("Leave applied successfully!");
      setShowLeaveForm(false);
      setLeaveDate("");
      setLeaveReason("");
    } catch (err) {
      setLeaveMsg("Failed to apply leave. Please try again.");
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    if (newPwd !== confirmPwd) {
      setPwdMsg("New passwords do not match.");
      return;
    }
    try {
      const employeeId = employee.employeeId;
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8091/usermanagement-service/api/user/change-password`,
        {},
        {
          params: {
            employeeId,
            oldPassword: oldPwd,
            newPassword: newPwd,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPwdMsg("Password changed successfully!");
      setTimeout(() => setPwdMsg(""), 3000);
      setShowChangePwd(false);
      setOldPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch {
      setPwdMsg("Failed to change password.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mr-4"></div>
        <span className="text-2xl text-blue-700 font-semibold">Loading employee details...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-2xl mx-auto mt-20 bg-white rounded-2xl shadow-xl p-8 text-center text-xl text-red-600">
        Unable to load employee details. Please try again later.
      </div>
    );
  }

  // Helper for salary structure
  const s = employee.salaryStructure || {};

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center drop-shadow">
        Welcome, <span className="text-pink-600">{employee.name || "Employee"}</span>!
      </h2>
      {/* Profile Section */}
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold text-blue-800 flex items-center gap-2">
            <svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="14" fill="#3b82f6" /><text x="14" y="20" textAnchor="middle" fontSize="16" fill="#fff">👤</text></svg>
            Profile
          </div>
          <button
            className="bg-yellow-500 text-white px-4 py-1 rounded shadow hover:bg-yellow-600 transition text-sm font-semibold"
            onClick={() => setShowChangePwd(true)}
          >
            Change Password
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
          <div><b>ID:</b> {employee.employeeId}</div>
          <div><b>Department:</b> {employee.department || "-"}</div>
          <div><b>Designation:</b> {employee.designation || "-"}</div>
          <div><b>Email:</b> {employee.email || "-"}</div>
          <div><b>Phone:</b> {employee.phone || "-"}</div>
          <div><b>Date of Joining:</b> {employee.joiningDate || "-"}</div>
          <div><b>Bank Name:</b> {employee.bankName || "-"}</div>
          <div><b>Account No:</b> {employee.accountNo || "-"}</div>
          <div><b>IFSC:</b> {employee.ifscCode || "-"}</div>
          <div><b>Address:</b> {employee.address || "-"}</div>
        </div>
        {/* Change Password Form */}
        {showChangePwd && (
          <form
            className="bg-yellow-50 p-4 rounded-xl flex flex-col gap-3 mb-2 mt-6 border border-yellow-200"
            onSubmit={handleChangePassword}
          >
            <div className="font-semibold text-yellow-800 mb-2">Change Password</div>
            <div>
              <label className="block font-semibold mb-1">Old Password</label>
              <input
                type="password"
                className="p-2 rounded border border-yellow-200 w-full"
                value={oldPwd}
                onChange={e => setOldPwd(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">New Password</label>
              <input
                type="password"
                className="p-2 rounded border border-yellow-200 w-full"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                className="p-2 rounded border border-yellow-200 w-full"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              >
                Change Password
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
                onClick={() => setShowChangePwd(false)}
              >
                Cancel
              </button>
            </div>
            {pwdMsg && (
              <div
                className={`mt-4 px-4 py-3 rounded shadow text-center font-semibold transition-all duration-500 ${
                  pwdMsg.includes("success")
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {pwdMsg}
                <button
                  className="ml-4 text-xs text-gray-500 hover:text-gray-800"
                  onClick={() => setPwdMsg("")}
                  type="button"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}
          </form>
        )}
      </div>
      {/* Salary Structure */}
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
          <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#f59e42" /><text x="12" y="17" textAnchor="middle" fontSize="12" fill="#fff">₹</text></svg>
          Salary Structure
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-2">
          <span className="bg-blue-50 px-2 py-1 rounded">
            Base: <b>₹{s.baseSalary?.toLocaleString() || "-"}</b>
          </span>
          <span className="bg-pink-50 px-2 py-1 rounded">
            HRA: <b>₹{s.hra?.toLocaleString() || "-"}</b>
          </span>
          <span className="bg-yellow-50 px-2 py-1 rounded">
            DA: <b>₹{s.da?.toLocaleString() || "-"}</b>
          </span>
          <span className="bg-green-50 px-2 py-1 rounded">
            Other: <b>₹{s.otherAllowance?.toLocaleString() || "-"}</b>
          </span>
        </div>
        <div className="mt-2 font-bold text-green-700 text-lg">
          Total: ₹
          {(
            (s.baseSalary || 0) +
            (s.hra || 0) +
            (s.da || 0) +
            (s.otherAllowance || 0)
          ).toLocaleString()}
        </div>
      </div>
      {/* Work Summary */}
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
          <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#10b981" /><text x="12" y="17" textAnchor="middle" fontSize="12" fill="#fff">⏱</text></svg>
          Work Summary
        </div>
        <div className="mt-2 flex flex-col gap-1 text-gray-700">
          <div>
            Total Hours Worked: <b>{workSummary?.totalHoursWorked ?? "-"}</b>
          </div>
          <div>
            Overtime Hours: <b>{workSummary?.totalOvertimeHours ?? "-"}</b>
          </div>
        </div>
      </div>
      {/* Payslips */}
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
          <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#6366f1" /><text x="12" y="17" textAnchor="middle" fontSize="12" fill="#fff">🧾</text></svg>
          Payslips
        </div>
        <ul className="list-disc ml-6 mt-2 text-blue-600 text-sm">
  <li>
    {new Date().toLocaleString("default", { month: "long", year: "numeric" })}{" "}
    <button
      className="ml-2 text-sm text-green-600 underline"
      onClick={async () => {
        try {
          await axios.post(
            `http://localhost:8087/payslip/generate/${employee.employeeId}`,
            null,
            { params: { month: new Date().toISOString().slice(0, 7) } }
          );
          navigate(`/payslip/${employee.employeeId}?month=${new Date().toISOString().slice(0, 7)}`);
        } catch (err) {
          alert("Failed to generate payslip!");
        }
      }}
    >
      Generate & View Payslip
    </button>
  </li>
</ul>
      </div>
      {/* Attendance Summary */}
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
          <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#f43f5e" /><text x="12" y="17" textAnchor="middle" fontSize="12" fill="#fff">📅</text></svg>
          Attendance Summary
        </div>
        <div className="mt-2 text-gray-700">
          Present Days: {workSummary?.totalHoursWorked ?? "-"} | Absent: {employee.absentDays || "-"} | Last Login: {employee.lastLogin || "-"}
        </div>
      </div>
      {/* Apply for Leave */}
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-bold text-blue-800 flex items-center gap-2">
            <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#3b82f6" /><text x="12" y="17" textAnchor="middle" fontSize="12" fill="#fff">🌴</text></svg>
            Apply for Leave
          </div>
          <button
            className={`px-4 py-1 rounded shadow text-sm font-semibold transition ${showLeaveForm ? "bg-gray-400 text-white hover:bg-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            onClick={() => setShowLeaveForm((v) => !v)}
          >
            {showLeaveForm ? "Cancel" : "Apply"}
          </button>
        </div>
        {showLeaveForm && (
          <form
            className="mt-4 bg-blue-50 p-4 rounded-xl flex flex-col gap-3 border border-blue-200"
            onSubmit={handleApplyLeave}
          >
            <div>
              <label className="block font-semibold mb-1">Leave Date</label>
              <input
                type="date"
                className="p-2 rounded border border-blue-200 w-full"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Leave Type</label>
              <select
                className="p-2 rounded border border-blue-200 w-full"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="CASUAL">Casual</option>
                <option value="SICK">Sick</option>
                <option value="EARNED">Earned</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Reason</label>
              <input
                type="text"
                className="p-2 rounded border border-blue-200 w-full"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Submit Leave Request
            </button>
          </form>
        )}
        {leaveMsg && (
          <div className="text-center text-blue-700 mt-4">{leaveMsg}</div>
        )}
      </div>
      {/* Leave History */}
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
          <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#f59e42" /><text x="12" y="17" textAnchor="middle" fontSize="12" fill="#fff">📜</text></svg>
          Leave History
        </div>
        {leaveHistory.length === 0 ? (
          <div className="text-gray-500">No leave records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full mt-2 text-sm border">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Reason</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="p-2 border">{leave.date}</td>
                    <td className="p-2 border">{leave.leaveType}</td>
                    <td className="p-2 border">{leave.reason}</td>
                    <td className="p-2 border">{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;