import { useEffect, useState } from "react";
import { TbLoader3 } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../api/userApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confPassword: "",
    username: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const getNewPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.error("Old password and new password cannot be the same");
      return;
    }

    setLoader(true);

    try {
      const response = await changePassword(formData);
      toast.success(response.message);

      setFormData({
        username: "",
        oldPassword: "",
        newPassword: "",
        confPassword: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <form
      className="flex flex-col items-center gap-5 bg-slate-50 border border-[#dadada] overflow-hidden w-[94%] max-w-[420px] lg:w-full rounded-lg"
      onSubmit={getNewPassword}
    >
      <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-5xl font-bold text-slate-50 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg xl:text-nowrap p-2">
        Update Password
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
              name="username"
              required
              placeholder="Enter username here.."
              onChange={handleOnChange}
              value={formData.username}
              className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
            />
            <input
              type="text"
              name="oldPassword"
              required
              placeholder="Enter old password here.."
              onChange={handleOnChange}
              value={formData.oldPassword}
              className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
            />
            <input
              type="password"
              required
              name="newPassword"
              value={formData.newPassword}
              placeholder="Enter new Password here.."
              onChange={handleOnChange}
              minLength="8"
              className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
            />
            <input
              type="password"
              required
              placeholder="Enter Confirm Password here.."
              name="confPassword"
              value={formData.confPassword}
              onChange={handleOnChange}
              minLength="8"
              className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
            />
            <button
              type="submit"
              className="w-[88%] text-slate-50 rounded-3xl text-2xl py-3 bg-gradient-to-r from-[#4A57CE] to-[#B151C2]"
            >
              Update Password
            </button>
          </div>
          <div className="flex flex-wrap w-full justify-around items-center">
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

export default UpdatePassword;
