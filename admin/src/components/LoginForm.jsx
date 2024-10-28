import { Icon } from "@iconify/react/dist/iconify.js";
import { useContext, useEffect, useState } from "react";
import adminContext from "../store/adminContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { emailRegex } from "../utils/registrationRegex";
import { login_Admin } from "../api/admin.api";
import { setLogin } from "../features/adminFeatures";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [dataProcessing, setDataProcessing] = useState(false);

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setLoginData((preData) => ({ ...preData, [name]: value }));
  };

  const { toggleDarkMode } = useContext(adminContext);

  const loginAdmin = async (e) => {
    e.preventDefault();

    let isValid = true;

    for (let key in loginData) {
      if (loginData[key].trim() === "" || !loginData[key]) {
        toast.error(`${key} is required`);
        isValid = false;
        break;
      }

      const value = loginData[key];

      if (key === "identifier" && loginData[key].includes("@")) {
        isValid = emailRegex.test(value);
        if (!isValid) {
          toast.error("Please enter a valid email address.");
        }
      }
    }

    if (isValid) {
      try {
        setDataProcessing(true);
        const res = await login_Admin(loginData);
        setLogin(true);
        toast.success(res.message);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setDataProcessing(false);
      }
    }
  };

  useEffect(() => {
    function setClassByOSMode() {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.className = "dark";
        toggleDarkMode(true);
      } else {
        document.documentElement.className = "light";
        toggleDarkMode(false);
      }
    }

    setClassByOSMode();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 backdrop-blur-lg bg-opacity-50 dark:bg-gray-900 p-0 sm:p-8">
      <form
        className="p-8 rounded-lg shadow-lg border border-gray-200 dark:border dark:border-gray-400 w-full max-w-md flex flex-col items-start gap-4"
        onSubmit={loginAdmin}
      >
        <h2 className="text-2xl font-semibold inline-flex justify-between items-center text-gray-800 dark:text-gray-200 mb-6 w-full text-center">
          Login
          <img
            src="/logo/DarkLogo.jpeg"
            alt="logoImage"
            className="h-12 w-12 object-contain"
          />
        </h2>
        <div className="inline-flex flex-col items-start gap-1 w-full">
          <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
            Username / Email :
          </label>
          <input
            name="identifier"
            type="text"
            value={loginData.identifier}
            onChange={handleOnChange}
            placeholder="Username or email"
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
              onChange={handleOnChange}
              value={loginData.password}
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
              )}
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
            "LogIn"
          )}
        </button>

        <span className="dark:text-slate-50 text-black text-lg text-center w-full">
          Don&apos;t have an account?
          <Link
            to="/admin-register"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Sign in here!
          </Link>
        </span>
        <span className="dark:text-red-600 text-black text-lg text-center w-full">
          Forget Password?
          <Link
            to="/admin-register"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Click here!
          </Link>
        </span>
      </form>
    </div>
  );
};

export default LoginForm;
