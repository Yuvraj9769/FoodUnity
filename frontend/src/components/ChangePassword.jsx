import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TbLoader3 } from "react-icons/tb";
import { checkTokenExipry, updatePassword } from "../api/userApi";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const newPassword = useRef("");
  const confPassword = useRef("");
  const username = useRef("");

  const navigate = useNavigate();

  const { token } = useParams();

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await checkTokenExipry({ token });
      } catch (error) {
        toast.error(error.message);
        setTimeout(() => {
          navigate("/");
        }, 0);
      }
    })();
  }, [navigate, token]);

  const getNewPassword = async (e) => {
    e.preventDefault();

    setLoader(true);

    if (newPassword.current.value !== confPassword.current.value) {
      toast.error("Passwords do not match. Please check and try again.");
    }

    const data = {
      username: username.current.value,
      newPassword: newPassword.current.value,
      token,
    };

    try {
      const res = await updatePassword(data);
      if (res?.message && res?.success) {
        toast.success(res?.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <form
      className="flex flex-col items-center gap-5 bg-slate-50 border border-[#dadada] overflow-hidden w-[94%] max-w-[420px] lg:w-full rounded-lg"
      onSubmit={getNewPassword}
    >
      <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-5xl font-bold text-slate-50 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg xl:text-nowrap p-2">
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
              placeholder="Enter username here.."
              ref={username}
              className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
            />

            <input
              type="password"
              required
              placeholder="Enter New Password here.."
              ref={newPassword}
              minLength="8"
              className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
            />
            <input
              type="password"
              required
              placeholder="Enter Confirm Password here.."
              ref={confPassword}
              minLength="8"
              className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
            />
            <button
              type="submit"
              className="w-[88%] text-slate-50 rounded-3xl text-2xl py-3 bg-gradient-to-r from-[#4A57CE] to-[#B151C2]"
            >
              Reset Password
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

export default ChangePassword;
