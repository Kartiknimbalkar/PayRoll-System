import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
// import Dashboard from "./Dashboard";
import Employees from "./Employees";
import Payroll from "./Payroll";
import AddEmployee from "./AddEmployee";
import Payslip from "./PaySlip";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";
import { useEffect, useState } from "react";

// Role-based dashboard redirector
function DashboardRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "ADMIN") navigate("/admin-dashboard", { replace: true });
    else if (role === "EMPLOYEE") navigate("/employee-dashboard", { replace: true });
    else if (role === "HR") navigate("/manager-dashboard", { replace: true });
    else navigate("/login", { replace: true });
  }, [navigate]);
  return null;
}

function Navbar() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/employees", label: "Employees" },
    { to: "/payroll", label: "Payroll" },
    { to: "/addEmployee", label: "Add Employee" },
    { to: "/login", label: "Login" },
  ];
  return (
    <nav className="bg-gradient-to-r from-red-700 via-pink-600 to-yellow-500 shadow-lg rounded-b-2xl px-8 py-5 flex justify-center items-center gap-10">
      <div className="flex gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`transition-all duration-200 px-5 py-2 rounded-lg font-semibold text-lg
              ${location.pathname === link.to
                ? "bg-white/20 shadow text-yellow-100 scale-105"
                : "hover:bg-white/10 hover:text-yellow-50"}
            `}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <span className="ml-8 text-2xl font-extrabold tracking-widest bg-white/10 px-4 py-1 rounded-lg text-yellow-100 shadow-lg hidden md:inline-block">
        PayRoll Pro
      </span>
    </nav>
  );
}

export default function App() {

  return (
    <Router>
      <Navbar />
      <div className="p-8">
        <Routes>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard/>} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/addEmployee" element={<AddEmployee />} />
          <Route path="/payslip/:payslipId" element={<Payslip />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}