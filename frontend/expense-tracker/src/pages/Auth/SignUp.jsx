import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'; // <-- import your selector
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import  uploadImage  from '../../utils/uploadImage'; // <-- import the upload function


const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  function validatePassword(password) {
    return /^(?=.*[!@#$%^&*])(?=.{8,})/.test(password);
  }

const handleSignUp = async (e) => {
  e.preventDefault();
  setError(null);

  let profileImageUrl="";

  if (!firstName.trim()) {
    setError("Please enter your first name.");
    return;
  }

  if (!lastName.trim()) {
    setError("Please enter your last name.");
    return;
  }

  if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!validatePassword(password)) {
    setError("Password must be at least 8 characters long and contain at least one special character.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  
  // Make the Sign Up API call
  try {
    //upload profile image if selected
    if (profilePic) {
      const imgUploadRes = await uploadImage(profilePic);
      profileImageUrl = imgUploadRes.imageUrl || ""; // Assuming the response contains the image
    }
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      firstName,
      lastName,
      email,
      password,
      profileImageUrl
    });
      
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      updateUser(user); // Update user context
      navigate("/dashboard");
    }
  } catch (err) {
    if (err.response && err.response.data.message) {
      setError(err.response.data.message);
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  }
};

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-8 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-1 mb-4">
          Join us and start tracking your expenses today!
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 px-3 py-1 rounded mb-3 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSignUp} className="space-y-3">
          {/* Profile Photo */}
          <div className="flex justify-center">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              label="First Name"
              type="text"
              className="h-9 text-sm"
            />

            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              label="Last Name"
              type="text"
              className="h-9 text-sm"
            />
          </div>

          {/* Email */}
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juandelacruz@example.com"
            label="Email Address"
            type="text"
            className="h-9 text-sm"
          />

          {/* Password */}
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            type="password"
            className="h-9 text-sm"
          />

          {/* Confirm Password */}
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
            type="password"
            className="h-9 text-sm"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-4 rounded-lg text-sm transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
