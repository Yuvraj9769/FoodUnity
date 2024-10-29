import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { emailRegex } from "../utils/registrationRegex";
import toast from "react-hot-toast";
import { sendForgetPasswordMail } from "../api/admin.api";

const ForgetPassword = () => {
  const [dataProcessing, setDataProcessing] = useState(false);

  const [sendMailData, setMailData] = useState({
    email: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMailData((preData) => ({ ...preData, [name]: value }));
  };

  const forgetPassword = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(sendMailData.email)) {
      toast.error("Please provide and valid email!");
      return;
    }

    try {
      setDataProcessing(true);
      const res = await sendForgetPasswordMail(sendMailData);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDataProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 backdrop-blur-lg bg-opacity-50 dark:bg-gray-900 p-0 sm:p-8">
      <form
        className="p-8 rounded-lg shadow-lg border border-gray-200 dark:border dark:border-gray-400 w-full max-w-md flex flex-col items-start gap-4"
        onSubmit={forgetPassword}
      >
        <h2 className="text-2xl font-semibold inline-flex justify-between items-center text-gray-800 dark:text-gray-200 mb-6 w-full text-center">
          Email Sender
          <img
            src="/logo/DarkLogo.jpeg"
            alt="logoImage"
            className="h-12 w-12 object-contain"
          />
        </h2>
        <div className="inline-flex flex-col items-start gap-1 w-full">
          <label className=" font-semibold text-slate-50 bg-gray-700 w-[50%] px-1 py-2 rounded-md">
            Email :
          </label>
          <input
            name="email"
            type="email"
            value={sendMailData.email}
            onChange={handleOnChange}
            placeholder="Email"
            className="w-full px-1 py-2 rounded-md border focus:border focus:border-gray-200 shadow transition duration-500 border-transparent outline-none"
            required
          />
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
            "Submit"
          )}
        </button>

        <span className="dark:text-slate-50 text-black text-lg text-center w-full">
          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Back
          </Link>
        </span>
      </form>
    </div>
  );
};

export default ForgetPassword;
