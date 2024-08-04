import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SERVER } from "../utils/server";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../features/foodUnity";
import { TbLoader3 } from "react-icons/tb";

const ChangePassword = () => {
  const oldPassword = useRef("");
  const newPassword = useRef("");
  const confPassword = useRef("");
  const navigate = useNavigate();

  const userData = useSelector((state) => state.userData);

  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  const getPasswords = async (e) => {
    e.preventDefault();

    const oldPass = oldPassword.current.value.trim();
    const newPass = newPassword.current.value.trim();
    const confPass = confPassword.current.value.trim();

    if ([oldPass, newPass, confPass].some((field) => field === "")) {
      toast.error("All fields are required!!");
      return;
    }

    if (oldPass === newPass || oldPass === confPass) {
      toast.error("New password cannot be same as old password!!");
      return;
    }

    if (newPass !== confPass) {
      toast.error("Password and confirm password does not match");
      return;
    }

    try {
      const response = await axios.patch(
        `${SERVER}/users/resetPassword/${token_React.current}`,
        {
          newPassword: newPass,
          oldPassword: oldPass,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        oldPassword.current.value = "";
        newPassword.current.value = "";
        confPassword.current.value = "";
        navigate("/");
        dispatch(getUserData()).then(() => {
          toast.success(response.data.message);
        });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Error in changing password";
      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={getPasswords}
      className="flex flex-col items-start gap-5 bg-slate-50 border border-[#dadada] overflow-hidden w-[94%] max-w-[420px] rounded-lg "
    >
      <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-5xl font-bold text-slate-50 p-2 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg">
        Change Password
      </h1>
      {loader ? (
        <span className="text-5xl text-black py-4 mx-auto animate-spin">
          <TbLoader3 />
        </span>
      ) : (
        <div className=" p-3 flex flex-col items-center gap-7 w-full text-black text-lg">
          <div className="w-full flex flex-col items-center gap-5">
            <input
              type="text"
              required
              placeholder="Enter Old Password here.."
              ref={oldPassword}
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
          <div className="flex w-full justify-around items-center">
            <Link to="/EmailSender">
              <p className="text-[#4E64D3] font-semibold hover:cursor-pointer hover:underline">
                Forgetpassword
              </p>
            </Link>
            <Link to="/">
              <p className="text-[#4E64D3] hover:cursor-pointer hover:underline">
                Go to Home
              </p>
            </Link>
          </div>
        </div>
      )}
    </form>
  );
};

export default ChangePassword;
