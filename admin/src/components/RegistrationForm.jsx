import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  emailRegex,
  fullNameRegex,
  passwordRegex,
  usernameRegex,
} from "../utils/registrationRegex";
import { register_Admin } from "../api/admin.api";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [dataProcessing, setDataProcessing] = useState(false);

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const registerAdmin = async (e) => {
    e.preventDefault();

    let isValid = true;

    for (let key in registerData) {
      const value = registerData[key].trim();

      if (value === "") {
        toast.error(`${key} is required`);
        isValid = false;
        break;
      }

      if (key === "fullName") {
        isValid = fullNameRegex.test(value);
        if (!isValid) {
          toast.error(
            "Full name must contain only letters, with at least two words."
          );
          break;
        }
      } else if (key === "email") {
        isValid = emailRegex.test(value);
        if (!isValid) {
          toast.error("Please enter a valid email address.");
          break;
        }
      } else if (key === "username") {
        isValid = usernameRegex.test(value);
        if (!isValid) {
          toast.error(
            "Username must be 3-15 characters, start with a letter, and contain only letters, numbers, or underscores."
          );
          break;
        }
      } else if (key === "password") {
        isValid = passwordRegex.test(value);
        if (!isValid) {
          toast.error(
            "Password must be at least one uppercase letter, one lowercase letter, one number, and one special character."
          );
          break;
        }
      }
    }

    if (isValid) {
      try {
        setDataProcessing(true);
        const response = await register_Admin(registerData);
        toast.success(response.message);
        navigate("/admin-login");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setDataProcessing(false);
      }
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setRegisterData((preData) => ({ ...preData, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 backdrop-blur-lg bg-opacity-50 dark:bg-gray-900 p-0 sm:p-8">
      <form
        className="p-8 rounded-lg shadow-lg border border-gray-200 dark:border dark:border-gray-400 w-full max-w-md flex flex-col items-start gap-4"
        onSubmit={registerAdmin}
      >
        <h2 className="text-2xl font-semibold inline-flex justify-between items-center text-gray-800 dark:text-gray-200 mb-6 w-full text-center">
          Register
          <img
            src="/logo/DarkLogo.jpeg"
            alt="logoImage"
            className="h-12 w-12 object-contain"
          />
        </h2>

        <div className="inline-flex flex-col items-start gap-1 w-full">
          <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
            Full Name :
          </label>
          <input
            type="text"
            name="fullName"
            value={registerData.fullName}
            onChange={handleOnChange}
            placeholder="Full Name (e.g. John Doe)"
            className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
            required
          />
        </div>
        <div className="inline-flex flex-col items-start gap-1 w-full">
          <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
            Username :
          </label>
          <input
            name="username"
            type="text"
            value={registerData.username}
            onChange={handleOnChange}
            placeholder="Username"
            className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
            required
          />
        </div>
        <div className="inline-flex flex-col items-start gap-1 w-full">
          <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
            Email :
          </label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleOnChange}
            placeholder="Email (e.g. example@domain.com)"
            className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
            required
          />
        </div>
        <div className="inline-flex flex-col items-start gap-1 w-full">
          <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
            Password :
          </label>
          <div className="bg-white w-full relative rounded-md border focus-within:border focus-within:border-gray-200 shadow transition duration-500 border-transparent">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={registerData.password}
              onChange={handleOnChange}
              placeholder="Password (Min 8 char)"
              minLength={8}
              className="w-[88%] px-1 py-2  outline-none"
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="text-xl text-black absolute right-4 bottom-3 cursor-pointer"
            >
              {showPassword ? (
                <Icon icon="jam:eye-close" />
              ) : (
                <Icon icon="radix-icons:eye-open" />
              )}{" "}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="text-slate-50 self-center px-5 py-2 rounded-md bg-teal-500 my-2 font-semibold hover:bg-teal-600 transition-colors duration-500 inline-flex items-center gap-2"
        >
          {dataProcessing ? (
            <>
              <Icon
                icon="line-md:loading-twotone-loop"
                className="text-2xl font-semibold"
              />
              Processing
            </>
          ) : (
            "Register"
          )}
        </button>

        <span className="dark:text-slate-50 text-black text-lg text-center w-full">
          Already have an account?
          <Link
            to="/admin-login"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Log in here!
          </Link>
        </span>
        <span className="dark:text-red-600 text-black text-lg text-center w-full">
          Forget Password?
          <Link
            to="/admin-forget-password"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Click here!
          </Link>
        </span>
      </form>
    </div>
  );
};

export default RegistrationForm;
