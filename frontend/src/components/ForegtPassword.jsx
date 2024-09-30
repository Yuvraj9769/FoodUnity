import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SERVER } from "../utils/server";
import axios from "axios";
import { TbLoader3 } from "react-icons/tb";

const ForegtPassword = () => {
  const newPassword = useRef("");
  const confPassword = useRef("");
  const username = useRef("");
  const navigate = useNavigate();
  const [loader, setloader] = useState(false);
  const token_React = useRef(null);
  const abortController = new AbortController();
  const signal = abortController.signal;

  const { token } = useParams();
  token_React.current = token;

  const getPasswords = async (e) => {
    e.preventDefault();

    const newPass = newPassword.current.value.trim();
    const confPass = confPassword.current.value.trim();
    const user = username.current.value.trim();

    if ([newPass, confPass, user].some((field) => field.trim() === "")) {
      toast.error("All fields are required!!");
      return;
    }

    if (newPass !== confPass) {
      toast.error("Password and confirm password do not match");
      return;
    }

    setloader(true);

    try {
      const response = await axios.patch(
        `${SERVER}/users/resetPassword/${token_React.current}`,
        {
          username: user,
          newPassword: newPass,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setloader(false);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      setloader(false);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    setloader(true);
    (async () => {
      try {
        await axios.get(
          `${SERVER}/users/checkExpiryTime/${token_React.current}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            signal,
          }
        );
        setloader(false);
      } catch (error) {
        navigate("/EmailSender");
        setloader(false);
        const errorMessage =
          error?.response?.data?.message || "Please try later";
        toast.error(errorMessage);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="bg-slate-950 h-screen w-full inline-flex items-center justify-center">
      <div className="flex flex-col items-start gap-5 bg-slate-50 border border-[#dadada] overflow-hidden w-[420px] rounded-lg ">
        <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-5xl font-bold text-slate-50 p-2 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg">
          Reset Password
        </h1>
        {loader ? (
          <span className="text-4xl sm:text-5xl text-black mx-auto py-4 animate-spin">
            <TbLoader3 />
          </span>
        ) : (
          <form
            onSubmit={getPasswords}
            className=" p-3 flex flex-col items-center gap-7 w-full text-black text-lg"
          >
            <div className="w-full flex flex-col items-center gap-5">
              <input
                type="text"
                required
                placeholder="Enter username here.."
                ref={username}
                className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
              />
              <input
                type="password"
                required
                placeholder="Enter New Password here.."
                ref={newPassword}
                className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
              />
              <input
                type="password"
                required
                placeholder="Enter Confirm Password here.."
                ref={confPassword}
                className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
              />
              <button
                type="submit"
                className="w-[88%] text-slate-50 rounded-3xl text-2xl py-3 bg-gradient-to-r from-[#4A57CE] to-[#B151C2]"
              >
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForegtPassword;
