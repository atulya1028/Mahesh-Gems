import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        window.dispatchEvent(new CustomEvent("loginSuccess"));
        navigate("/");
      } else {
        setErrorMessage(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error logging in. Please try again later.");
      console.error(error);
    }
  };

  // Optional: Explicitly handle Enter key on inputs (uncomment if needed)
  /*
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Return") {
      handleLogin(e);
    }
  };
  */

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow"
        aria-label="Login form"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center">Login</h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-500">{errorMessage}</div>
        )}

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

        <button
          type="submit"
          className="w-full p-2 text-white bg-yellow-600 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          aria-label="Submit login"
        >
          Login
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
          <span>
            Not a user?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Please Sign up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;