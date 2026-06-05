
import { useState } from "react";
import axios from "axios";

function Login({ setIsLoggedIn }) {
  const [isSignup, setIsSignup] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const API =
    "https://expense-tracker-backend-x4ur.onrender.com";

  const login = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setIsLoggedIn(true);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${API}/signup`,
        {
          name,
          email,
          password,
        }
      );

      alert(
        "Account created successfully! Please login."
      );

      setIsSignup(false);

      setName("");
      setPassword("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center px-4">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-white text-4xl font-bold text-center mb-2">
          Expense Tracker
        </h1>

        <p className="text-slate-400 text-center mb-8">
          {isSignup
            ? "Create a new account"
            : "Login to continue"}
        </p>

        <div className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700"
          />

          <button
            onClick={
              isSignup
                ? signup
                : login
            }
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() =>
              setIsSignup(
                !isSignup
              )
            }
            className="text-blue-400 hover:text-blue-300"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Create one"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            JWT Authentication Enabled
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

