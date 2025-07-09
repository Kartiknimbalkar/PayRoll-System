import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Payslip() {
  const { payslipId } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`http://localhost:8087/payslip/generate/${payslipId}`)
      .then((res) => {
        setPayslip(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [payslipId]);

  const handleDownloadPdf = async () => {
    if (!payslip) return;
    try {
      const url = `http://localhost:8087/payslip/pdf/${payslip.employeeId}/${payslip.month}`;
      const response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Payslip_${payslip.employeeId}_${payslip.month}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Failed to download PDF");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading payslip...</div>;
  if (!payslip) return <div className="p-8 text-center text-red-500">Payslip not found.</div>;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 z-50"
      style={{ minHeight: "100vh" }}
    >
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl flex flex-col min-h-[80vh] border border-blue-200">
        <div className="flex justify-between items-center px-8 pt-8 pb-2 border-b">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">Payslip</h2>
          <button
            onClick={handleDownloadPdf}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition text-sm font-semibold"
          >
            Download PDF
          </button>
        </div>
        <div className="px-8 py-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <div className="flex flex-wrap gap-8 mb-2">
            <div>
              <div className="text-gray-500 text-xs">Employee ID</div>
              <div className="font-semibold">{payslip.employeeId}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Month</div>
              <div className="font-semibold">{payslip.month}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Generated</div>
              <div className="font-semibold">{payslip.generatedDate}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-white/80 rounded-xl p-6 shadow">
            <PayslipRow label="Gross Pay" value={payslip.grossPay} highlight />
            <PayslipRow label="Net Pay" value={payslip.netPay} highlight green />
            <PayslipRow label="Fixed Salary" value={payslip.fixedSalary} />
            <PayslipRow label="Hourly Rate" value={payslip.hourlyRate} />
            <PayslipRow label="Hours Worked" value={payslip.hoursWorked} />
            <PayslipRow label="HRA" value={payslip.hra} />
            <PayslipRow label="DA" value={payslip.da} />
            <PayslipRow label="Travel Allowance" value={payslip.travelAllowance} />
            <PayslipRow label="Medical Allowance" value={payslip.medicalAllowance} />
            <PayslipRow label="Bonus" value={payslip.bonus} />
            <PayslipRow label="Meal Allowance" value={payslip.mealAllowance} />
            <PayslipRow label="Other Benefits" value={payslip.otherBenefits} />
            <PayslipRow label="Total Benefits" value={payslip.totalBenefits} />
            <PayslipRow label="Tax Deducted" value={payslip.taxDeducted} red />
            <PayslipRow label="Total Deductions" value={payslip.totalDeductions} red />
          </div>
        </div>
        <div className="sticky bottom-0 left-0 w-full bg-gradient-to-r from-blue-600 to-pink-500 rounded-b-2xl">
          <button
            onClick={() => navigate(-1)}
            className="w-full text-white font-bold py-3 text-lg hover:bg-pink-600 transition rounded-b-2xl"
          >
            ← Back to Employees
          </button>
        </div>
      </div>
    </div>
  );
}

function PayslipRow({ label, value, highlight, green, red }) {
  return (
    <div className={`flex justify-between items-center py-1 px-2 rounded ${highlight ? (green ? "bg-green-100 font-bold text-green-700" : "bg-blue-100 font-bold text-blue-700") : ""} ${red ? "text-red-600" : ""}`}>
      <span>{label}:</span>
      <span>
        {typeof value === "number" ? `₹${value.toLocaleString()}` : value}
      </span>
    </div>
  );
}