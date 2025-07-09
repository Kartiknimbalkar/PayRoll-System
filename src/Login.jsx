import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Login() {
  const [empID, setEmpID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:8091/usermanagement-service/api/user/login",
        { employeeId: empID, password },
        { headers: { "Content-Type": "application/json" } }
      );
      // localStorage.setItem("token", res.data);
      // localStorage.setItem("employeeId", empID);
      
      const token = res.data.token || res.data; // adjust if your backend returns {token: "..."}
      localStorage.setItem("token", token);
      localStorage.setItem("employeeId", empID);

      const decoded = jwtDecode(token);
      localStorage.setItem("role", decoded.role); // adjust 'role' key as per your JWT payload

      navigate("/dashboard");
      
    } catch (err) {
        if (err.response && err.response.data) {
          const errorMessage =
            err.response.data.message || "Login failed. Please try again.";
          setError(errorMessage);
        } else {
          setError("Network error. Please try again later.");
        }
      }
    setLoading(false);
  };

  // Logout handler
const handleLogout = async () => {
  const employeeId = localStorage.getItem("employeeId");
  const token = localStorage.getItem("token");
  if (!employeeId) {
    setError("No employee ID found for logout.");
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
    setError(""); // clear any previous error
    // Show a success message for 1 second, then redirect
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Logout successful!");
      navigate("/login");
    }, 1000);
  } catch (err) {
    console.error("Logout failed:", err);
    setError("Logout failed. Please try again.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6 border border-blue-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-2">Employee Login</h2>
        <input
          type="text"
          placeholder="Employee ID"
          className="p-3 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={empID}
          onChange={(e) => setEmpID(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold py-3 rounded-lg shadow hover:from-blue-700 hover:to-pink-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {/* Example logout button for demonstration */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 bg-red-500 text-white py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </form>
    </div>
  );
}