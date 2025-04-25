import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirmPassword) {
      setMsg("❌ Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("https://mahesh-gems-api.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("✅ Signup successful!");
        navigate("/login");
      } else {
        setMsg(`❌ ${data.message}`);
      }
    } catch (error) {
      setMsg("❌ Something went wrong.");
    }
  };

  // Optional: Explicitly handle Enter key on inputs (uncomment if needed)
  /*
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Return") {
      handleSignup(e);
    }
  };
  */

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-montserrat">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-8 bg-white rounded shadow"
        aria-label="Sign up form"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Signup</h2>
        {msg && <p className="mb-4 text-center text-red-600">{msg}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Full name"
          // onKeyDown={handleKeyDown} // Uncomment if using explicit keydown handler
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          // onKeyDown={handleKeyDown} // Uncomment if using explicit keydown handler
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label="Password"
          // onKeyDown={handleKeyDown} // Uncomment if using explicit keydown handler
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-4 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          aria-label="Confirm password"
          // onKeyDown={handleKeyDown} // Uncomment if using explicit keydown handler
        />

        <button
          type="submit"
          className="w-full p-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Submit signup"
        >
          Signup
        </button>

        <div className="mt-6 text-sm text-center text-gray-600">
          Already a user?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Please Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;