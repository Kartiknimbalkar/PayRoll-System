import { useState } from "react";
import axios from "axios";

const initialEmployee = {
  name: "",
  email: "",
  role: "",
  department: "",
  designation: "",
  phone: "",
  joiningDate: "",
  bankName: "",
  accountNo: "",
  salaryStructure: {
    type: "",
    baseSalary: "",
    hra: "",
    bonus: "",
    da: "",
    travelAllowance: "",
    medicalAllowance: "",
    hourlyRate: "",
    healthInsurance: "",
    providentFund: "",
    mealAllowance: "",
    otherBenefits: "",
  },
};

export default function AddEmployee() {
  const [employee, setEmployee] = useState(initialEmployee);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    if (name in employee.salaryStructure) {
      setEmployee((prev) => ({
        ...prev,
        salaryStructure: {
          ...prev.salaryStructure,
          [name]: value,
        },
      }));
    } else {
      setEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Convert numeric fields to numbers
      const salary = {};
      for (const key in employee.salaryStructure) {
        salary[key] =
          key === "type"
            ? employee.salaryStructure[key]
            : Number(employee.salaryStructure[key]) || 0;
      }
      const payload = { ...employee, salaryStructure: salary };
      await axios.post("http://localhost:8091/employee-service/api/employee/add", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSuccess("Employee added successfully!");
      setEmployee(initialEmployee);
    } catch (err) {
      setError("Failed to add employee.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Add New Employee</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={employee.name} onChange={handleChange} required placeholder="Name" className="input input-bordered w-full p-2 rounded border" />
          <input name="email" value={employee.email} onChange={handleChange} required type="email" placeholder="Email" className="input input-bordered w-full p-2 rounded border" />
          <input name="role" value={employee.role} onChange={handleChange} required placeholder="Role" className="input input-bordered w-full p-2 rounded border" />
          <input name="department" value={employee.department} onChange={handleChange} placeholder="Department" className="input input-bordered w-full p-2 rounded border" />
          <input name="designation" value={employee.designation} onChange={handleChange} placeholder="Designation" className="input input-bordered w-full p-2 rounded border" />
          <input name="phone" value={employee.phone} onChange={handleChange} placeholder="Phone" className="input input-bordered w-full p-2 rounded border" />
          <input name="joiningDate" value={employee.joiningDate} onChange={handleChange} type="date" placeholder="Joining Date" className="input input-bordered w-full p-2 rounded border" />
          <input name="bankName" value={employee.bankName} onChange={handleChange} placeholder="Bank Name" className="input input-bordered w-full p-2 rounded border" />
          <input name="accountNo" value={employee.accountNo} onChange={handleChange} placeholder="Account No" className="input input-bordered w-full p-2 rounded border" />
        </div>
        <div className="mt-4">
          <div className="font-semibold text-blue-700 mb-2">Salary Structure</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="type" value={employee.salaryStructure.type} onChange={handleChange} placeholder="Type (hourly/fixed/hybrid)" className="input input-bordered w-full p-2 rounded border" />
            <input name="baseSalary" value={employee.salaryStructure.baseSalary} onChange={handleChange} type="number" placeholder="Base Salary" className="input input-bordered w-full p-2 rounded border" />
            <input name="hra" value={employee.salaryStructure.hra} onChange={handleChange} type="number" placeholder="HRA" className="input input-bordered w-full p-2 rounded border" />
            <input name="bonus" value={employee.salaryStructure.bonus} onChange={handleChange} type="number" placeholder="Bonus" className="input input-bordered w-full p-2 rounded border" />
            <input name="da" value={employee.salaryStructure.da} onChange={handleChange} type="number" placeholder="DA" className="input input-bordered w-full p-2 rounded border" />
            <input name="travelAllowance" value={employee.salaryStructure.travelAllowance} onChange={handleChange} type="number" placeholder="Travel Allowance" className="input input-bordered w-full p-2 rounded border" />
            <input name="medicalAllowance" value={employee.salaryStructure.medicalAllowance} onChange={handleChange} type="number" placeholder="Medical Allowance" className="input input-bordered w-full p-2 rounded border" />
            <input name="hourlyRate" value={employee.salaryStructure.hourlyRate} onChange={handleChange} type="number" placeholder="Hourly Rate" className="input input-bordered w-full p-2 rounded border" />
            <input name="healthInsurance" value={employee.salaryStructure.healthInsurance} onChange={handleChange} type="number" placeholder="Health Insurance" className="input input-bordered w-full p-2 rounded border" />
            <input name="providentFund" value={employee.salaryStructure.providentFund} onChange={handleChange} type="number" placeholder="Provident Fund" className="input input-bordered w-full p-2 rounded border" />
            <input name="mealAllowance" value={employee.salaryStructure.mealAllowance} onChange={handleChange} type="number" placeholder="Meal Allowance" className="input input-bordered w-full p-2 rounded border" />
            <input name="otherBenefits" value={employee.salaryStructure.otherBenefits} onChange={handleChange} type="number" placeholder="Other Benefits" className="input input-bordered w-full p-2 rounded border" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
          {loading ? "Adding..." : "Add Employee"}
        </button>
        {success && <div className="text-green-600 text-center mt-2">{success}</div>}
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
}