import { useState } from "react";

const LoginFormEmail = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form className="form-glass p-8 rounded-lg shadow-lg w-full max-w-md bg-white/30 dark:bg-gray-800/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Login with Email
        </h2>
        <input type="email" placeholder="Email" className="input" required />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input"
            required
          />
          <span
            onClick={togglePassword}
            className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-300"
          >
            &#128065;
          </span>
        </div>
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginFormEmail;
