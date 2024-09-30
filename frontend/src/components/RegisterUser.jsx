import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import checkStringLowerCase from "../utils/stringLowerChecker";
import registerDataChecker from "../utils/registerChecker";
import Loader from "./Loader";
import validator from "validator";
import { registerUser } from "../api/userApi";
import { IoMdArrowDropdown } from "react-icons/io";

const RegisterUser = () => {
  const navigate = useNavigate();
  const username = useRef("");
  const email = useRef("");
  const fullName = useRef("");
  const password = useRef("");
  const mobNo = useRef("");
  const confPassword = useRef("");
  const userType = useRef("");

  const [disPassword, setDispassword] = useState({
    password: false,
    confPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();

    if (!checkStringLowerCase(username.current.value)) {
      return toast.error("Username must be in lower case");
    }

    let emptyStringChecker = registerDataChecker(
      username.current.value,
      fullName.current.value,
      password.current.value,
      mobNo.current.value
    );

    if (emptyStringChecker) {
      toast.error(emptyStringChecker);
      return;
    }

    if (!validator.isEmail(email.current.value)) {
      email.current.value = "";
      toast.error("Please enter a valid email");
      return;
    }

    if (password.current.value !== confPassword.current.value) {
      password.current.value = "";
      confPassword.current.value = "";
      return toast.error("Password and confirm password does not match");
    }

    if (userType.current.value === "Select User Type") {
      toast.error("Please select user type");
      return;
    }

    setLoading(true);

    const data = {
      username: username.current.value,
      fullName: fullName.current.value,
      email: email.current.value,
      mobNo: Number.parseInt(mobNo.current.value),
      password: password.current.value,
      userType: userType.current.value,
    };

    try {
      const res = await registerUser(data);

      setTimeout(() => {
        toast.success(res.message);
        setLoading(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      setLoading(false);
      if (error.message === "Please login") {
        toast.error(error.message);
        navigate("/");
        return;
      }
      toast.error(error.message);
    }
  };

  const displayAndHidePassword = (password, confPassword) => {
    if (password === "password") {
      setDispassword({
        password: !disPassword.password,
        confPassword: disPassword.confPassword,
      });
    } else if (confPassword === "confPassword") {
      setDispassword({
        password: disPassword.password,
        confPassword: !disPassword.confPassword,
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-7 w-full md:my-4">
      <h1 className="text-slate-50 text-4xl font-semibold bg-gradient-to-r from-[#4A57CE] to-[#B151C2] bg-clip-text text-transparent py-2">
        User Registration
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={register}
          className="border border-[#616060] shadow-md flex justify-center flex-col items-start gap-4 p-2 rounded-lg w-[95%] max-w-[420px] sm:w-[420px] bg-slate-700 dark:bg-black text-slate-50"
        >
          <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
            <label>Full Name:</label>
            <input
              type="text"
              id="fullName"
              ref={fullName}
              placeholder="Enter full name.."
              required
              className="text-black text-base outline-none border-none rounded-md p-2 w-full sm:text-lg lg:text-base"
            />
          </div>
          <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
            <label>Username:</label>
            <input
              type="text"
              id="username"
              required
              ref={username}
              placeholder="Enter username.."
              className="text-black text-base outline-none border-none rounded-md p-2 w-full sm:text-lg lg:text-base"
            />
          </div>
          <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
            <label>Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email.."
              ref={email}
              required
              className="text-black text-base outline-none border-none rounded-md p-2 w-full sm:text-lg lg:text-base"
            />
          </div>
          <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg">
            <label>Mobile Number:</label>
            <input
              type="text"
              ref={mobNo}
              required
              id="MobileNumber"
              placeholder="Enter mobile number.."
              className="text-black text-base outline-none border-none rounded-md p-2 w-full sm:text-lg lg:text-base"
            />
          </div>
          <div className="relative w-full text-black">
            <label
              htmlFor="userType"
              className="block font-semibold text-lg mb-1"
            >
              User Type:
            </label>
            <select
              id="userType"
              required
              defaultValue="Select User Type"
              ref={userType}
              className="outline-none border appearance-none border-[#dadada] rounded-md w-full p-3 text-base sm:text-lg lg:text-base"
            >
              <option disabled>Select User Type</option>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
            </select>
            <p className="absolute top-[55%] right-4 text-xl pointer-events-none">
              <IoMdArrowDropdown />
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg relative">
            <label>Password:</label>
            <input
              type={disPassword.password ? "text" : "password"}
              id="password"
              ref={password}
              placeholder="Enter password.."
              required
              minLength={8}
              className="text-black text-base outline-none border-none rounded-md p-2 w-full sm:text-lg lg:text-base"
            />
            <p
              className="absolute right-3 bottom-3 text-black z-30 eye cursor-pointer"
              onClick={() => displayAndHidePassword("password")}
            >
              {disPassword.password ? <FaEye /> : <FaEyeSlash />}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 w-full font-semibold text-lg relative">
            <label>Confirm Password:</label>
            <input
              type={disPassword.confPassword ? "text" : "password"}
              id="confirmPassword"
              ref={confPassword}
              placeholder="Confirm password.."
              required
              minLength={8}
              className="text-black text-base outline-none border-none rounded-md p-2 w-full sm:text-lg lg:text-base"
            />
            <p
              className="absolute right-3 bottom-3 text-black z-30 eye cursor-pointer"
              onClick={() => displayAndHidePassword(null, "confPassword")}
            >
              {disPassword.confPassword ? <FaEye /> : <FaEyeSlash />}
            </p>
          </div>
          <button
            type="submit"
            className="text-slate-50 text-lg mb-2 bg-blue-700 px-4 py-2 rounded-lg outline-none border-none hover:bg-blue-800 self-center duration-200"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterUser;
