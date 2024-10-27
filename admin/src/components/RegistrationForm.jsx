import { useContext, useEffect, useState } from "react";
import adminContext from "../store/adminContext";
import { Icon } from "@iconify/react/dist/iconify.js";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { toggleDarkMode } = useContext(adminContext);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 backdrop-blur-lg bg-opacity-50 dark:bg-gray-900 p-8">
      <div className="relative overflow-hidden max-w-[450px] h-full w-full z-20 inline-flex items-center justify-center before:w-[98%] before:h-full before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[url('../public/logo/LightLogo.jpeg')] before:p-0 before:bg-no-repeat  dark:before:opacity-90 before:opacity-70 before:bg-center before:z-10">
        <form className="p-8 relative z-30 rounded-lg shadow-lg border border-gray-200 dark:border dark:border-gray-400 w-full max-w-md flex flex-col items-start gap-4">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6 w-full text-center">
            Register
          </h2>
          <div className="inline-flex flex-col items-start gap-1 w-full">
            <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
              Full Name :
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
              required
            />
          </div>
          <div className="inline-flex flex-col items-start gap-1 w-full">
            <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
              Username :
            </label>
            <input
              type="text"
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
              placeholder="Email"
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
            className="dark:text-slate-50 self-center px-5 py-2 rounded-md bg-teal-500 my-2 font-semibold hover:bg-teal-600 transition-colors duration-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
