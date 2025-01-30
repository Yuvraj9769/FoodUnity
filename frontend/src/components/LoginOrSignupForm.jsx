import { useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import secureLocalStorage from "react-secure-storage";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, setIsLoggedIn, setPostData } from "../features/foodUnity";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../api/userApi";
import { getAllPostsForUser, getDonorPostedPosts } from "../api/foodApi";

const LoginOrSignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postData = useSelector((state) => state.postData);
  const [disPassword, setDispassword] = useState(false);
  const [dataProcessing, setDataProcessing] = useState(false);
  const username = useRef("");
  const password = useRef("");
  const check = useRef(false);

  const getLoginData = async (e) => {
    e.preventDefault();

    setDataProcessing(true);

    const enteredUsername = username.current.value.trim();
    const enteredPassword = password.current.value.trim();

    if (enteredUsername === "") {
      toast.error("Username is required");
      return;
    }

    if (enteredPassword === "") {
      toast.error("Password is required");
      return;
    }

    const data = {
      username: enteredUsername,
      password: enteredPassword,
      rememberme: check.current.checked,
    };

    try {
      const res = await loginUser(data);

      if (res.data === "donor") {
        secureLocalStorage.setItem("donor", true);
        if (postData.length === 0) {
          getDonorPostedPosts()
            .then((data) => {
              dispatch(setPostData(data));
            })
            .catch((error) => toast.error(error.message));
        }
      }

      if (res.data === "recipient") {
        secureLocalStorage.setItem("recipient", true);
      }

      secureLocalStorage.setItem("user", true);
      toast.success(res.message);
      dispatch(setIsLoggedIn(true));
      dispatch(getUserData());

      if (
        postData.length === 0 &&
        secureLocalStorage.getItem("user") &&
        !secureLocalStorage.getItem("donor")
      ) {
        getAllPostsForUser()
          .then((value) => dispatch(setPostData(value)))
          .catch((error) => toast.error(error.message));
      }

      navigate("/");
    } catch (error) {
      username.current.value = "";
      password.current.value = "";
      toast.error(error.message);
      if (error.message === "Please register") {
        navigate("/register");
      }
    } finally {
      setDataProcessing(false);
    }
  };

  return (
    <div className="flex flex-col my-4 items-start font-semibold gap-5 bg-slate-50 border border-[#dadada] overflow-hidden w-[95%] max-w-[420px] sm:w-[420px] rounded-lg ">
      <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-4xl sm:text-5xl font-bold text-slate-50 p-2 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg">
        Login Form
      </h1>
      <form
        onSubmit={getLoginData}
        className="p-3 flex flex-col items-center gap-7 w-full text-black text-lg"
      >
        <div className="w-full flex flex-col items-center gap-5 relative">
          <input
            id="username"
            type="text"
            required
            placeholder="Enter Username here"
            ref={username}
            className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
          />

          <input
            id="password"
            type={disPassword ? "text" : "password"}
            required
            placeholder="Enter Password here"
            ref={password}
            minLength={8}
            className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
          />
          <p
            className="absolute right-10 top-[93px] eye cursor-pointer"
            onClick={() => setDispassword(!disPassword)}
          >
            {disPassword ? <FaEye /> : <FaEyeSlash />}
          </p>

          <div className="flex sm:justify-between sm:flex-row flex-col items-center w-[88%]">
            <div className="p-2 px-3">
              <label className="text-nowrap inline-flex items-center gap-3">
                <input
                  id="checkbox"
                  type="checkbox"
                  ref={check}
                  className="h-4 w-4"
                />
                Remember Me
              </label>
            </div>
            <Link to="/emailSender">
              <p className="text-[#4E64D3] font-semibold hover:cursor-pointer hover:underline">
                Forgot Password?
              </p>
            </Link>
          </div>
          <button
            type="submit"
            className="w-[88%] text-slate-50 rounded-3xl text-xl sm:text-2xl py-3 bg-gradient-to-r from-[#4A57CE] to-[#B151C2] inline-flex items-center gap-2 justify-center"
          >
            {dataProcessing ? (
              <>
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="text-2xl font-semibold"
                />
                Processing
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="flex flex-col w-full gap-3 items-center">
          <Link to="/loginemail">
            <p className="text-[#4E64D3] hover:cursor-pointer hover:underline text-lg sm:text-xl">
              Login Via Email
            </p>
          </Link>
          <p className="sm:text-xl text-lg">
            Not a member?
            <Link to="/register">
              <span className="text-[#4E64D3] hover:cursor-pointer hover:underline ml-2">
                Signup now
              </span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginOrSignupForm;
