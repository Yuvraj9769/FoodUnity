import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import validator from "validator";
import { TbLoader3 } from "react-icons/tb";
import { sendResetPasswordMail } from "../api/userApi";

const EmailSender = () => {
  const email = useRef("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const getEmail = async (e) => {
    e.preventDefault();

    const enteredEmail = email.current.value.trim();

    if (!validator.isEmail(enteredEmail)) {
      email.current.value = "";
      toast.error("Email is not valid!!");
      return;
    }

    setLoader(true);

    const data = {
      email: enteredEmail,
    };

    try {
      await sendResetPasswordMail(data);
      setLoader(false);
      toast.success("Please check your email");
      navigate("/");
    } catch (error) {
      setLoader(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="dark:bg-slate-950 bg-slate-50 h-screen w-full inline-flex items-center justify-center">
      <div className="flex flex-col mx-auto items-start gap-5 bg-slate-50 border border-[#dadada] overflow-hidden w-auto lg:w-[420px] rounded-lg ">
        <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-5xl font-bold text-slate-50 p-1 sm:p-2 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg">
          Reset Password
        </h1>

        {loader ? (
          <span className="text-5xl text-black py-4 mx-auto animate-spin">
            <TbLoader3 />
          </span>
        ) : (
          <form
            onSubmit={getEmail}
            className=" p-3 flex flex-col items-center gap-7 w-full text-black text-lg"
          >
            <div className="w-full flex flex-col items-center gap-5">
              <input
                type="email"
                placeholder="Enter email here.."
                ref={email}
                required
                className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
              />
              <button
                type="submit"
                className="w-[88%] text-slate-50 rounded-3xl text-2xl py-3 bg-gradient-to-r from-[#4A57CE] to-[#B151C2]"
              >
                Send Mail
              </button>
            </div>
            <div className="flex w-full justify-center items-center">
              <Link to="/">
                <p className="text-[#4E64D3] hover:cursor-pointer hover:underline">
                  Exit
                </p>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailSender;
