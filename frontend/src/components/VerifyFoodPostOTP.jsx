import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { verifyUserOTP } from "../api/foodApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TbLoader3 } from "react-icons/tb";

const VerifyFoodPostOTP = () => {
  const [OTPVerifiedDet, setOTPVerifiedDet] = useState({});
  const [loading, setLoading] = useState(false);
  const otpInput = useRef("");

  const userData = useSelector((state) => state.userData);
  const navigate = useNavigate();

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otp = otpInput.current.value;

    if (!otp || otp.trim() === "" || otp.length < 6) {
      toast.error("Enter valid OTP");
      otpInput.current.value = "";
      setLoading(false);
      return;
    }

    const otpNumber = Number.parseInt(otp);

    try {
      const res = await verifyUserOTP(otpNumber, userData.username);
      toast.success(res.message);
      setOTPVerifiedDet(res.data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="bg-slate-50 sm:w-[380px] flex flex-col items-center gap-5 p-4 rounded-md shadow-lg shadow-gray-500 dark:shadow-slate-600 my-8 w-[85vw] mx-auto">
      {Object.keys(OTPVerifiedDet).length === 0 ? (
        <>
          {!loading ? (
            <>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#4A57CE] to-[#B151C2] bg-clip-text text-transparent">
                OTP Verification
              </h1>
              <form
                action=""
                onSubmit={verifyOTP}
                className="flex flex-col items-center gap-3 p-2 w-full"
              >
                <input
                  type="text"
                  ref={otpInput}
                  required
                  maxLength={6}
                  placeholder="Enter 6 Digit OTP"
                  className="p-2 outline-none border w-full focus-within:border-green-400 duration-300 rounded-md mb-2"
                />
                <button
                  type="submit"
                  className="bg-green-400 w-full text-slate-50 px-2 py-1 rounded-md hover:bg-green-500 duration-500"
                >
                  Verify OTP
                </button>
              </form>
            </>
          ) : (
            <p className="rounded-full text-3xl text-blue-700 cursor-pointer animate-spin">
              <TbLoader3 />
            </p>
          )}
        </>
      ) : (
        <div className="rounded-lg flex flex-col items-center gap-4 w-full">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4A57CE] to-[#B151C2] bg-clip-text text-transparent">
            OTP Verified
          </h1>
          <div className="p-4 rounded-lg flex flex-col items-start gap-4 w-full">
            <h3 className="text-black text-2xl font-medium">
              Recipient Details:
            </h3>
            <div className=" p-4 pl-1 rounded-md flex flex-col items-start gap-3 w-full overflow-x-auto scroller-display-none-otpPage">
              <p className="text-black  text-lg">
                <b>Username:</b> {OTPVerifiedDet?.username}
              </p>
              <p className="text-black  text-lg">
                <b>FullName</b>: {OTPVerifiedDet?.fullName}
              </p>
              <p className="text-black text-lg text-nowrap">
                <b>Email</b>: {OTPVerifiedDet?.email}
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-slate-50 px-4 py-2 font-semibold hover:bg-blue-500 duration-500 rounded-md outline-none self-center"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyFoodPostOTP;
