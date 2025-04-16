import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Success or error message
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://mahesh-gems-api.vercel.app/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password reset link sent to your email.");
        setEmail("");
      } else {
        setMessage(data.message || "❌ Unable to process request.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <form
        onSubmit={handleForgotPassword}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center">
          Forgot Password
        </h2>

        {message && (
          <div
            className={`mb-4 text-sm ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-yellow-400" : "bg-yellow-600 hover:bg-yellow-700"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
