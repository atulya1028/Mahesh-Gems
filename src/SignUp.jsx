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
      const res = await fetch("https://mahesh-gems-api.vercel.app/api/auth/signup", {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-montserrat">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-8 bg-white rounded shadow"
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
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-4 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full p-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
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
