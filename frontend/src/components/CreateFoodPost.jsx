import { useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import handlePermissionRequest from "../utils/getUserLocation";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setPostData } from "../features/foodUnity";
import { createFoodPost, getDonorPostedPosts } from "../api/foodApi";
import { useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import { getuserLocationWhileRegister } from "../api/userApi";
import { ImSpinner3 } from "react-icons/im";

const CreateFoodPost = () => {
  const location = useSelector((state) => state.location);
  const dispatch = useDispatch();
  const title = useRef("");
  const quantity = useRef(1);
  const foodType = useRef("");
  const expTime = useRef("");
  const img = useRef("");
  const pickupTime = useRef("");
  const pickupOption = useRef("");
  const name = useRef("");
  const desc = useRef("");
  const number = useRef("");

  const [locationLoader, setLocationLoader] = useState(false);

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const getUserCurrentLocation = async () => {
    try {
      setLocationLoader(true);
      const res = await handlePermissionRequest();
      const locationData = await getuserLocationWhileRegister(res);
      dispatch(setLocation(locationData.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLocationLoader(false);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();

    if (
      [
        title.current.value,
        foodType.current.value,
        expTime.current.value,
        img.current.value,
        pickupTime.current.value,
        name.current.value,
        number.current.value,
        pickupOption.current.value,
      ].some((field) => field.trim() === "")
    ) {
      toast.error("All fields are required");
      return;
    }

    if (!location) {
      toast.error("location is required");
      return;
    }

    setLoader(true);

    const currentDate = new Date().toISOString().split("T")[0];

    const expiryTime = `${currentDate}T${expTime.current.value}:00.000Z`;

    const formdata = new FormData();

    formdata.append("foodTitle", title.current.value);
    formdata.append("quantity", quantity.current.value);
    formdata.append("foodType", foodType.current.value);
    formdata.append("expiryTime", expiryTime);
    formdata.append("pickupLocation", location);
    formdata.append("foodImage", img.current.files[0]);
    formdata.append("pickupTime", pickupTime.current.value);
    formdata.append("contactName", name.current.value);
    formdata.append("description", desc.current.value);
    formdata.append("contactNumber", number.current.value);
    formdata.append("pickupOptions", pickupOption.current.value);

    const res = await createFoodPost(formdata);

    if (res?.data?.success) {
      toast.success("Post created successfully");
      navigate("/");
      const res = new Promise((resolve, reject) => {
        getDonorPostedPosts()
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      });

      res
        .then((data) => dispatch(setPostData(data)))
        .catch((err) => toast.error(err));
    } else {
      const errorMessage = res?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
    setLoader(true);
  };

  return (
    <>
      {loader ? (
        <PageLoader />
      ) : (
        <form
          onSubmit={createPost}
          className="border border-[#616060] shadow-md flex flex-col gap-4 p-4 rounded-lg w-[95%] max-w-[420px] sm:w-[420px] bg-slate-700 dark:bg-black text-slate-50"
        >
          <h1 className="text-slate-50 text-4xl font-semibold bg-gradient-to-r from-[#4A57CE] to-[#B151C2] bg-clip-text text-transparent py-2">
            Post Food Information
          </h1>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="foodTitle">Title:</label>
            <input
              type="text"
              id="foodTitle"
              ref={title}
              placeholder="Enter food title.."
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="description">Description (Optional) :</label>
            <textarea
              id="description"
              ref={desc}
              required
              placeholder="Enter food description.."
              className="text-black text-base outline-none border-none rounded-md p-2 h-24 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold relative">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              min={1}
              ref={quantity}
              id="quantity"
              placeholder="Enter quantity.."
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold relative text-black">
            <label htmlFor="foodType" className="text-slate-50">
              Select Food Type
            </label>
            <select
              id="foodType"
              required
              ref={foodType}
              defaultValue="Select Food Type"
              className="outline-none border appearance-none border-[#dadada] rounded-md w-full p-3"
            >
              <option disabled>Select Food Type</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
            <p className="absolute top-[60%] right-4 text-xl pointer-events-none">
              <IoMdArrowDropdown />
            </p>
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="pickupLocation">Pickup Location:</label>
            {location ? (
              <button className="bg-blue-500 pointer-events-none opacity-70 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none">
                {location}
              </button>
            ) : (
              <button
                type="button"
                onClick={getUserCurrentLocation}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none inline-flex items-center justify-center gap-4"
              >
                {locationLoader && <ImSpinner3 className="animate-spin" />} Get
                Current Location
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 font-semibold relative">
            <label htmlFor="expiryDate">Expiry Time:</label>
            <input
              type="time"
              ref={expTime}
              id="expiryDate"
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold relative text-slate-50">
            <label htmlFor="pickupLocation">Pickup Option:</label>
            <select
              id="pickupOption"
              required
              ref={pickupOption}
              defaultValue="Select Pickup Option"
              className="outline-none text-black border appearance-none border-[#dadada] rounded-md w-full p-3"
            >
              <option disabled>Select Pickup Option</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
            <p className="absolute top-[60%] right-4 text-xl pointer-events-none">
              <IoMdArrowDropdown />
            </p>
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="foodImage">Upload Image:</label>
            <input
              type="file"
              ref={img}
              name="foodImage"
              id="foodImage"
              accept="image/*"
              required
              className="text-slate-50 text-base outline-none border border-slate-200 dark:border-gray-700 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold relative">
            <label htmlFor="pickupTime">Preferred Pickup Time:</label>
            <input
              type="time"
              ref={pickupTime}
              id="pickupTime"
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="contactName">Contact Name:</label>
            <input
              type="text"
              id="contactName"
              ref={name}
              maxLength={16}
              placeholder="Enter contact name.."
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="contactNumber">Contact Number:</label>
            <input
              type="tel"
              id="contactNumber"
              ref={number}
              placeholder="Enter contact number.."
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="text-slate-50 text-lg bg-blue-700 px-4 py-2 rounded-lg outline-none border-none hover:bg-blue-800 self-center duration-200"
          >
            Create Post
          </button>
        </form>
      )}
    </>
  );
};

export default CreateFoodPost;
