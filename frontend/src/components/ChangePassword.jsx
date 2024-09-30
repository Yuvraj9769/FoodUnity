import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TbLoader3 } from "react-icons/tb";

const ChangePassword = () => {
  const oldPassword = useRef("");
  const newPassword = useRef("");
  const confPassword = useRef("");

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  }, []);

  return (
    <form className="flex flex-col items-center gap-5 bg-slate-50 border border-[#dadada] overflow-hidden w-[94%] max-w-[420px] lg:w-full rounded-lg">
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
          <div className="flex flex-wrap w-full justify-around items-center">
            <Link to="/EmailSender">
              <p className="text-[#4E64D3] font-semibold hover:cursor-pointer hover:underline">
                Forget password
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
