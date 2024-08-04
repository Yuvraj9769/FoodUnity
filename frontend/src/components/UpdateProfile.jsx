import React, { useRef } from "react";
import axios from "axios";
import { SERVER } from "../utils/server";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../features/foodUnity";
import validator from "validator";

const UpdateProfile = () => {
  const username = useRef("");
  const email = useRef("");
  const fullName = useRef("");
  const bio = useRef("");
  const mobNo = useRef(0);
  const date = useRef("");
  const gender = useRef("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userData = useSelector((state) => state.userData);

  const updateData = async (e) => {
    e.preventDefault();

    if (
      [
        username.current.value,
        email.current.value,
        fullName.current.value,
        bio.current.value,
        date.current.value,
        gender.current.value,
      ].some((field) => field.trim() === "")
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!mobNo) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    if (!validator.isEmail(email.current.value)) {
      email.current.value = "";
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const response = await axios.patch(
        `${SERVER}/users/updateProfile`,
        {
          username: username.current.value,
          email: email.current.value,
          fullName: fullName.current.value,
          bio: bio.current.value,
          date: date.current.value,
          gender: gender.current.value,
          mobNo: mobNo.current.value,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        navigate("/");
        dispatch(getUserData());
        toast.success(response.data.message);
      }
    } catch (error) {
      username.current.value = "";
      email.current.value = "";
      fullName.current.value = "";
      bio.current.value = "";
      date.current.value = "";
      gender.current.value = "";

      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={updateData}
      className="flex flex-col items-center gap-5 border border-[#dadada] overflow-hidden w-[95%] sm:w-[440px] rounded-lg pb-4 text-slate-50"
    >
      <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-4xl lg:text-5xl font-bold text-slate-50 p-2 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg">
        Update Form
      </h1>

      <div className="w-full flex flex-col items-start gap-5 p-2">
        <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
          <label className="dark:text-slate-50 text-black">Full Name:</label>
          <input
            type="text"
            id="fullName"
            ref={fullName}
            defaultValue={userData?.fullName}
            placeholder="Enter full name.."
            required
            className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
          <label className="dark:text-slate-50 text-black">Username:</label>
          <input
            type="text"
            id="username"
            required
            ref={username}
            defaultValue={userData?.username}
            placeholder="Enter username.."
            className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
          <label className="dark:text-slate-50 text-black">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email.."
            ref={email}
            defaultValue={userData?.email}
            required
            className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
          <label className="dark:text-slate-50 text-black">
            Mobile Number:
          </label>
          <input
            type="number"
            ref={mobNo}
            required
            min={0}
            defaultValue={userData?.mobileNumber}
            id="MobileNumber"
            placeholder="Enter mobile number.."
            className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
          <label className="dark:text-slate-50 text-black">
            Date of birth:
          </label>
          <input
            type="date"
            id="date"
            ref={date}
            defaultValue={(userData?.dateOfBirth || "").split("T")[0]}
            required
            className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
          <label className="dark:text-slate-50 text-black">Gender:</label>
          <select
            id="gender"
            ref={gender}
            required
            className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
          >
            <option value="male">{userData?.gender || ""} (Registered)</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="preferNotToSay">Prefer not to say</option>
          </select>
        </div>
        <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
          <label className="dark:text-slate-50 text-black">Bio:</label>
          <textarea
            id="bio"
            ref={bio}
            maxLength={200}
            defaultValue={userData?.bio}
            required
            placeholder="Enter a short bio.."
            className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
          />
        </div>
      </div>
      <Link to="/changePassword">
        <p className="text-gray-800 text-lg dark:text-slate-300 text-center p-2 px-4 w-full rounded-3xl border border-[#cfcfcf]">
          Change Password
        </p>
      </Link>
      <button
        type="submit"
        className="w-[70%] text-slate-50 rounded-3xl text-xl sm:text-2xl py-3 bg-gradient-to-r from-[#4A57CE] to-[#B151C2]"
      >
        Update
      </button>
      <div className="flex w-full text-lg justify-center items-center">
        <Link to="/">
          <p className="text-[#4E64D3] hover:cursor-pointer hover:underline">
            Back
          </p>
        </Link>
      </div>
    </form>
  );
};

export default UpdateProfile;
