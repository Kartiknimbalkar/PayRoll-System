import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Employees from "./Employees";
import Payroll from "./Payroll";
import AddEmployee from "./AddEmployee";
import Payslip from "./PaySlip";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";
import { useEffect, useState } from "react";
import LeaveApproval from "./LeaveApproval";
import axios from "axios";
import UpdateEmployee from "./UpdateEmployee";
import DeleteEmployee from "./DeleteEmployee";
import { ToastContainer } from "react-toastify";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Welcome to PayRoll Pro</h1>
      <p className="mb-8 text-lg text-gray-700 text-center max-w-xl">
        Manage employees, payroll, and leave approvals with ease. Please login to continue.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold py-3 px-8 rounded-lg shadow hover:from-blue-700 hover:to-pink-600 transition text-lg"
      >
        Login
      </button>
    </div>
  );
}

function HrNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { to: "/manager-dashboard", label: "Dashboard" },
    { to: "/employees", label: "Employees" },
    { to: "/addEmployee", label: "Add Employee" },
    { to: "/leave-approval", label: "Leave Approval" },
    { to: "/update-employee", label: "Update Employee" },
    { to: "/delete-employee", label: "Delete Employee" },
  ];

  const handleLogout = async () => {
    const employeeId = localStorage.getItem("employeeId");
    const token = localStorage.getItem("token");
    if (!employeeId) {
      alert("No employee ID found for logout.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8091/usermanagement-service/api/user/logout",
        { employeeId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.clear();
      toast.success("Logout successful!");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 shadow-lg rounded-b-2xl px-8 py-5 flex justify-between items-center">
      <div className="flex gap-6">
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
      <div className="flex items-center gap-6">
        <span className="text-2xl font-extrabold tracking-widest bg-white/10 px-4 py-1 rounded-lg text-yellow-100 shadow-lg">
          PayRoll Pro
        </span>
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function EmployeeNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { to: "/employee-dashboard", label: "Dashboard" },
  ];

  const handleLogout = async () => {
    const employeeId = localStorage.getItem("employeeId");
    const token = localStorage.getItem("token");
    if (!employeeId) {
      alert("No employee ID found for logout.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8091/usermanagement-service/api/user/logout",
        { employeeId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.clear();
      // alert("Logout successful!");
      toast.success("Logout successful!");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-800 via-green-600 to-green-400 shadow-lg rounded-b-2xl px-8 py-5 flex justify-between items-center">
      <div className="flex gap-6">
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
      <div className="flex items-center gap-6">
        <span className="text-2xl font-extrabold tracking-widest bg-white/10 px-4 py-1 rounded-lg text-yellow-100 shadow-lg">
          PayRoll Pro
        </span>
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function RoleNavbar() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  useEffect(() => {
    const onStorage = () => setRole(localStorage.getItem("role"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  if (role === "EMPLOYEE") return <EmployeeNavbar />;
  return <HrNavbar />;
}

export default function App() {

    const [showConfetti, setShowConfetti] = useState(false);

  // callback we'll hand to <Login />
  const handleLoginSuccess = (name) => {
    // fire toast
    toast.success(`Welcome back, ${name}! 🎉`, { position: 'top-center', autoClose: 3000 });
    // show one-time confetti
    setShowConfetti(true);
    // turn it off after 3s
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <Router>


      <ToastContainer />
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Only show navbar if not on home or login page */}
      <ConditionalNavbar />
      <div className="p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard/>} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/addEmployee" element={<AddEmployee />} />
          <Route path="/payslip/:payslipId" element={<Payslip />} />
          <Route path="/leave-approval" element={<LeaveApproval />} />
          <Route path="/update-employee" element={<UpdateEmployee />} />
          <Route path="/delete-employee" element={<DeleteEmployee />} />
          <Route path="/update-employee/:id" element={<UpdateEmployee />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess}/>} />
        </Routes>
      </div>
    </Router>
  );
}

// Conditionally render navbar based on route
function ConditionalNavbar() {
  const location = useLocation();
  // Hide navbar on home and login pages
  if (location.pathname === "/" || location.pathname === "/login") return null;
  return <RoleNavbar />;
}