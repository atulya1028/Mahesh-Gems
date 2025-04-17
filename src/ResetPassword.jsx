import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match.");
      setMessage("");
      return;
    }

    if (newPassword.length < 6) {
      setError("❌ Password must be at least 6 characters.");
      setMessage("");
      return;
    }

    const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!isStrongPassword.test(newPassword)) {
      setError("❌ Password must be at least 8 characters long, and include an uppercase letter, a number, and a special character.");
      setMessage("");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`https://mahesh-gems-api.vercel.app/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "❌ Something went wrong.");
        setMessage("");
        return;
      }

      setMessage(data.message);
      setError("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("❌ Network error. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-center">🔐 Reset Password</h2>

        {message && <p className="mb-4 text-center text-green-600">{message}</p>}
        {error && (
          <div className="flex items-center justify-between p-3 mb-4 text-red-800 bg-red-200 rounded">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold text-red-600">✖</button>
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
