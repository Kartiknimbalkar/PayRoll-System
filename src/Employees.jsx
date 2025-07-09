import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8091/employee-service/api/employee/getAll", {
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-700 drop-shadow-lg tracking-tight">
          Employee Directory
        </h2>
        {loading ? (
          <div className="text-center text-gray-500 py-16 text-xl animate-pulse">Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className="text-center text-red-500 py-16 text-xl">No employees found.</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {employees.map((emp, idx) => {
              console.log(emp);
              const s = emp.salaryStructure || {};
              const totalSalary =
                (s.baseSalary || 0) +
                (s.hra || 0) +
                (s.da || 0);

              return (
                <div
                  key={emp.employeeId || idx}
                  className="relative bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3 hover:scale-[1.025] hover:shadow-2xl transition-all border border-blue-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-pink-700 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 mr-1"></span>
                      {emp.name}
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold shadow">{emp.department}</span>
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">{emp.designation}</div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg width="16" height="16" fill="none" className="inline-block"><circle cx="8" cy="8" r="8" fill="#3b82f6" /><text x="8" y="12" textAnchor="middle" fontSize="10" fill="#fff">@</text></svg>
                      {emp.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="16" height="16" fill="none" className="inline-block"><circle cx="8" cy="8" r="8" fill="#f59e42" /><text x="8" y="12" textAnchor="middle" fontSize="10" fill="#fff">☎</text></svg>
                      {emp.phone}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Joining: <span className="font-semibold">{emp.joiningDate}</span></span>
                    <span>Bank: <span className="font-semibold">{emp.bankName}</span></span>
                    <span>Acc: <span className="font-mono">{emp.accountNo}</span></span>
                  </div>
                  <div className="mt-2 border-t pt-2">
                    <div className="font-semibold text-blue-700 mb-1">Salary Structure</div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                      <span className="bg-blue-50 px-2 py-1 rounded">Base: <b>₹{s.baseSalary?.toLocaleString() || "-"}</b></span>
                      <span className="bg-pink-50 px-2 py-1 rounded">HRA: <b>₹{s.hra?.toLocaleString() || "-"}</b></span>
                      <span className="bg-yellow-50 px-2 py-1 rounded">DA: <b>₹{s.da?.toLocaleString() || "-"}</b></span>
                    </div>
                    <div className="mt-2 font-bold text-green-700 text-lg">
                      Total: ₹{totalSalary.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-pink-600 transition text-sm font-semibold"
                      onClick={async () => {
                        try {
                          await axios.post(
                            `http://localhost:8087/payslip/generate/${emp.employeeId}`
                          );
                          navigate(`/payslip/${emp.employeeId}`);
                        } catch (err) {
                          alert("Failed to generate payslip!");
                        }
                      }}
                    >
                      Generate Payslip
                    </button>
                  </div>
                  {/* <div className="absolute top-4 right-4">
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold shadow">
                      {emp.role}
                    </span>
                  </div> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}