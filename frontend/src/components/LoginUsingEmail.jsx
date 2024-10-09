import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import secureLocalStorage from "react-secure-storage";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, setIsLoggedIn, setPostData } from "../features/foodUnity";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import validator from "validator";
import { loginUser } from "../api/userApi";
import { getAllPostsForUser, getDonorPostedPosts } from "../api/foodApi";

const LoginUsingEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postData = useSelector((state) => state.postData);

  const [disPassword, setDispassword] = useState(false);
  const email = useRef("");
  const password = useRef("");
  const check = useRef(false);

  const getLoginData = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(email.current.value.trim())) {
      email.current.value = "";
      toast.error("Please enter a valid email");
      return;
    }
    if (password.current.value.trim() === "") {
      toast.error("password is required");
      return;
    }

    const data = {
      email: email.current.value,
      password: password.current.value,
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
      email.current.value = "";
      password.current.value = "";
      toast.error(error.message);
      if (error.message === "Please register") {
        navigate("/register");
      }
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col items-start my-4 mx-auto gap-5 border border-[#dadada] overflow-hidden w-[95%] max-w-[420px] sm:w-[420px] rounded-lg ">
      <h1 className="bg-gradient-to-r from-[#4A57CE] to-[#B151C2] text-5xl font-bold text-slate-50 p-2 inline-flex items-center justify-center w-full h-[135px] rounded-tl-lg rounded-tr-lg">
        Login Form
      </h1>
      <form
        onSubmit={getLoginData}
        className="p-3 flex flex-col items-center gap-7 w-full text-black text-lg"
      >
        <div className="w-full flex flex-col items-center gap-5 relative">
          <input
            type="email"
            placeholder="Enter email here"
            ref={email}
            required
            className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
          />

          <input
            type={disPassword ? "text" : "password"}
            ref={password}
            required
            minLength={8}
            placeholder="Enter Password here"
            className="outline-none border border-[#dadada] rounded-3xl w-[88%] p-3"
          />
          <p
            className="absolute right-10 top-[93px] eye cursor-pointer"
            onClick={() => setDispassword(!disPassword)}
          >
            {disPassword ? <FaEye /> : <FaEyeSlash />}
          </p>
          <div className="flex justify-between items-center w-[88%] sm:flex-row flex-col">
            <div className="p-2 px-3">
              <label className="text-nowrap inline-flex items-center gap-3">
                <input type="checkbox" ref={check} className="h-4 w-4" />
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
            className="w-[88%] text-slate-50 rounded-3xl text-2xl py-3 bg-gradient-to-r from-[#4A57CE] to-[#B151C2]"
          >
            Login
          </button>
        </div>
        <div className="flex flex-col w-full gap-3 items-center">
          <Link to="/login">
            <p className="text-[#4E64D3] text-lg sm:text-xl hover:cursor-pointer hover:underline">
              Login Via Username
            </p>
          </Link>
          <p className="text-xl">
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

export default LoginUsingEmail;
