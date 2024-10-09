import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { updateProfileData } from "../api/userApi";
import { setUserData } from "../features/foodUnity";
import PageLoader from "./PageLoader";

const UpdateProfile = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userData = useSelector((state) => state.userData);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "",
    mobNo: "",
  });

  const handleFormData = (e) => {
    const { id, value } = e.target;

    setFormData((preData) => ({
      ...preData,
      [id]: value,
    }));
  };

  const updateData = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(formData.email)) {
      toast.error("Invalid Email");
      return;
    }

    if (!validator.isMobilePhone(formData.mobNo)) {
      toast.error("Invalid Mobile Number");
      return;
    }

    setLoader(true);

    try {
      const res = await updateProfileData(formData);

      if (res.success) {
        toast.success(res.message);
        dispatch(setUserData(res.data));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }

    setLoader(true);

    if (userData) {
      setFormData({
        username: userData?.username || "",
        email: userData?.email || "",
        fullName: userData?.fullName || "",
        role: userData?.role || "",
        mobNo: userData?.mobileNumber || "",
      });

      setLoader(false);
    }
  }, [isLoggedIn, navigate, userData]);

  return (
    <>
      {loader ? (
        <PageLoader />
      ) : (
        <form
          onSubmit={updateData}
          className="flex flex-col items-center gap-5 border border-[#dadada] overflow-hidden w-[95%] sm:w-[440px] rounded-lg pb-4 text-slate-50"
        >
          <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-4xl lg:text-5xl font-bold text-slate-50 p-2 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg">
            Update Form
          </h1>

          <div className="w-full flex flex-col items-start gap-5 p-2">
            <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
              <label className="dark:text-slate-50 text-black">
                Full Name:
              </label>
              <input
                type="text"
                id="fullName"
                onChange={handleFormData}
                value={formData?.fullName}
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
                onChange={handleFormData}
                readOnly
                value={formData?.username}
                className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
              />
            </div>
            <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
              <label className="dark:text-slate-50 text-black">Email:</label>
              <input
                type="email"
                id="email"
                onChange={handleFormData}
                placeholder="Enter email.."
                value={formData?.email}
                required
                className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
              />
            </div>
            <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
              <label className="dark:text-slate-50 text-black">Role:</label>
              <input
                type="text"
                id="role"
                onChange={handleFormData}
                readOnly
                value={formData?.role}
                className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
              />
            </div>
            <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
              <label className="dark:text-slate-50 text-black">
                Mobile Number:
              </label>
              <input
                type="text"
                id="mobNo"
                onChange={handleFormData}
                value={formData?.mobNo}
                required
                className="text-black text-base outline-none rounded-md p-2 w-full sm:text-lg lg:text-base border border-[#dadada]"
              />
            </div>
          </div>
          <Link to="/updatePassword">
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
      )}
    </>
  );
};

export default UpdateProfile;
