import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkTokenExpiry, resetAdminPassword } from "../api/admin.api";
import toast from "react-hot-toast";
import { passwordRegex } from "../utils/registrationRegex";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [dataProcessing, setDataProcessing] = useState(false);

  const navigate = useNavigate();

  const { token } = useParams();

  const [newPassword, setNewPassword] = useState({
    password: "",
    confPassword: "",
    token,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setNewPassword((preData) => ({ ...preData, [name]: value }));
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (
      !passwordRegex.test(newPassword.password) ||
      !passwordRegex.test(newPassword.confPassword)
    ) {
      toast.error(
        "Password must be at least 8 characters long, and must contain at least one number, one uppercase letter, one lowercase letter, and one special character."
      );
      return;
    }

    if (newPassword.password !== newPassword.confPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setDataProcessing(true);
      const res = await resetAdminPassword(newPassword);
      toast.success(res.message);
      navigate("/admin-login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDataProcessing(false);
    }
  };

  useEffect(() => {
    if (token) {
      setDataProcessing(true);

      checkTokenExpiry({ token })
        .then(() => {})
        .catch((error) => {
          toast.error(error.message);
          navigate("/admin-forget-password");
        })
        .finally(() => setDataProcessing(false));
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 backdrop-blur-lg bg-opacity-50 dark:bg-gray-900 p-0 sm:p-8">
      <form
        className="p-8 rounded-lg shadow-lg border border-gray-200 dark:border dark:border-gray-400 w-full max-w-md flex flex-col items-start gap-4"
        onSubmit={resetPassword}
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
            Password :
          </label>
          <div className="bg-white w-full relative rounded-md border focus-within:border focus-within:border-gray-200 shadow transition duration-500 border-transparent">
            <input
              type={showPassword.password ? "text" : "password"}
              name="password"
              onChange={handleOnChange}
              value={newPassword.password}
              placeholder="Password (Min 8 char)"
              minLength={8}
              className="w-[88%] px-1 py-2  outline-none"
              required
            />

            <span
              onClick={() =>
                setShowPassword({
                  password: !showPassword.password,
                  confPassword: showPassword.confPassword,
                })
              }
              className="text-xl text-black absolute right-4 bottom-3 cursor-pointer"
            >
              {showPassword.password ? (
                <Icon icon="jam:eye-close" />
              ) : (
                <Icon icon="radix-icons:eye-open" />
              )}
            </span>
          </div>
        </div>
        <div className="inline-flex flex-col items-start gap-1 w-full">
          <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
            Confirm Password :
          </label>
          <div className="bg-white w-full relative rounded-md border focus-within:border focus-within:border-gray-200 shadow transition duration-500 border-transparent">
            <input
              type={showPassword.confPassword ? "text" : "password"}
              name="confPassword"
              onChange={handleOnChange}
              value={newPassword.confPassword}
              placeholder="Confirm Password (Min 8 char)"
              minLength={8}
              className="w-[88%] px-1 py-2  outline-none"
              required
            />

            <span
              onClick={() =>
                setShowPassword({
                  password: showPassword.password,
                  confPassword: !showPassword.confPassword,
                })
              }
              className="text-xl text-black absolute right-4 bottom-3 cursor-pointer"
            >
              {showPassword.confPassword ? (
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
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
