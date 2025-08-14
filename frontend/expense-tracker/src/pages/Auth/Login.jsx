import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return /^(?=.*[!@#$%^&*])(?=.{8,})/.test(password);
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!validatePassword(password)) {
    setError("Password must be at least 8 characters long and contain at least one special character.");
    return;
  }

  // * (optional) If you keep confirmPassword in Login:
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  // TODO: Make the Login API call

  setError(null);
  try {
    const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
    const { token, user } = data;

    if (token) {
      localStorage.setItem("token", token);
      // updateUser(user); // if you have this
      navigate("/dashboard");
    } else {
      setError("Login failed: token not received.");
    }
  } catch (err) {
    // You’ll see the failed request in Network > Fetch/XHR (status 401)
    if (err.response?.status === 401) {
      setError("Invalid email or password.");
    } else if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.request) {
      setError("No response from server. Please check your network connection.");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  }
};

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="juandelacruz@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Enter Password"
            placeholder=""
            type="password"
          />
          <Input
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            label="Confirm Password"
            placeholder=""
            type="password"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
