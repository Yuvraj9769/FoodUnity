import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import handlePermissionRequest from "../utils/getUserLocation";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setPostData } from "../features/foodUnity";
// import { getDonorPostedPosts } from "../api/foodApi";
import PageLoader from "./PageLoader";
import { useNavigate, useParams } from "react-router-dom";
import extractTime from "../utils/extractTime";
import { getDonorPostedPosts, updateFoodPost } from "../api/foodApi";
import getJustMinutes from "../utils/getJustMinutes";
import calculateTimeDifferenceString from "../utils/calculateTimeDifferenceString";

const UpdateFoodPostForm = () => {
  const location = useSelector((state) => state.location);
  const postData = useSelector((state) => state.postData);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { ind } = useParams();

  const [updatePostData, setUpdatePostData] = useState({
    id: "",
    title: "",
    quantity: 0,
    foodType: "",
    expTime: "",
    foodImage: "",
    pickupTime: "",
    pickupOption: "",
    name: "",
    desc: "",
    number: "",
    pickupLocation: "",
  });

  const [loader, setLoader] = useState(false);

  const getUserCurrentLocation = async () => {
    try {
      const res = await handlePermissionRequest();
      dispatch(setLocation(res.data));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createFormData = (data) => {
    const currentDate = new Date().toISOString().split("T")[0];

    const expiryTime = `${currentDate}T${data.expTime}:00.000Z`;

    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("quantity", data.quantity);
    formData.append("foodType", data.foodType);
    formData.append("expTime", expiryTime);
    formData.append("pickupLocation", data.pickupLocation);
    formData.append("foodImage", data.foodImage);
    formData.append("pickupTime", data?.pickupTime);
    formData.append("name", data?.name);
    formData.append("number", data.number);
    formData.append("pickupOption", data.pickupOption);
    return formData;
  };

  const updatePost = async (e) => {
    e.preventDefault();

    const formData = createFormData(updatePostData);

    setLoader(true);

    try {
      const res = await updateFoodPost(formData);
      if (res.statusCode === 200 && res.success) {
        toast.success(res.message);
        const updatedData = await getDonorPostedPosts();
        dispatch(setPostData(updatedData));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
      navigate("/posts");
    }
  };

  const handleUpdatingData = (e) => {
    const { id, value, files } = e.target;
    setUpdatePostData((preData) => ({ ...preData, [id]: files?.[0] || value }));
  };

  useEffect(() => {
    if (postData) {
      let time = calculateTimeDifferenceString(postData[ind].createdAt);

      if (!getJustMinutes(time)) {
        toast.error("You can update your post within 10 minutes of uploading.");
        navigate("/posts");
        return;
      }

      const formatExpTime = extractTime(postData[ind].expiryTime);

      if (postData[ind].pickupLocation) {
        dispatch(setLocation(postData[ind]?.pickupLocation));
      }

      setUpdatePostData({
        id: postData[ind]._id,
        title: postData[ind].foodTitle,
        desc: postData[ind].description,
        quantity: postData[ind].quantity,
        foodType: postData[ind].foodType,
        expTime: formatExpTime,
        pickupLocation: postData[ind].pickupLocation,
        foodImage: "",
        pickupTime: postData[ind].pickupTime,
        name: postData[ind].contactName,
        number: postData[ind].contactNumber,
        pickupOption: postData[ind].pickupOptions,
      });
    }
  }, [postData, ind]);

  return (
    <>
      {loader ? (
        <PageLoader />
      ) : (
        <form
          onSubmit={updatePost}
          className="border border-[#616060] shadow-md flex flex-col gap-4 p-4 rounded-lg w-[95%] max-w-[420px] sm:w-[420px] bg-slate-700 dark:bg-black text-slate-50"
        >
          <h1 className="text-slate-50 text-4xl font-semibold bg-gradient-to-r from-[#4A57CE] to-[#B151C2] bg-clip-text text-transparent py-2">
            Post Food Information
          </h1>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="foodTitle">Title:</label>
            <input
              type="text"
              id="title"
              value={updatePostData.title}
              onChange={handleUpdatingData}
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="description">Description (Optional) :</label>
            <textarea
              id="desc"
              value={updatePostData.desc}
              onChange={handleUpdatingData}
              required
              className="text-black text-base outline-none border-none rounded-md p-2 h-24 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold relative">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              min={1}
              value={updatePostData.quantity}
              onChange={handleUpdatingData}
              id="quantity"
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
              value={updatePostData.foodType}
              onChange={handleUpdatingData}
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
            {location && updatePostData?.pickupLocation ? (
              <button className="bg-blue-500 pointer-events-none opacity-70 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none">
                {location}
              </button>
            ) : (
              <button
                type="button"
                id="pickupLocation"
                value={updatePostData.pickupLocation}
                onClick={getUserCurrentLocation}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none"
              >
                Get Current Location
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 font-semibold relative">
            <label htmlFor="expiryDate">Expiry Time:</label>
            <input
              type="time"
              id="expTime"
              value={updatePostData.expTime}
              onChange={handleUpdatingData}
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold relative text-slate-50">
            <label htmlFor="pickupLocation">Pickup Option:</label>
            <select
              id="pickupOption"
              required
              value={updatePostData.pickupOption}
              onChange={handleUpdatingData}
              className="outline-none border text-black appearance-none border-[#dadada] rounded-md w-full p-3"
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
            <label htmlFor="foodImage">Upload New Image:</label>
            <input
              type="file"
              value={updatePostData.img}
              onChange={handleUpdatingData}
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
              value={updatePostData.pickupTime}
              onChange={handleUpdatingData}
              id="pickupTime"
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="contactName">Contact Name:</label>
            <input
              type="text"
              id="name"
              value={updatePostData.name}
              onChange={handleUpdatingData}
              maxLength={16}
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <label htmlFor="contactNumber">Contact Number:</label>
            <input
              type="tel"
              id="number"
              value={updatePostData.number}
              onChange={handleUpdatingData}
              required
              className="text-black text-base outline-none border-none rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="text-slate-50 text-lg bg-blue-700 px-4 py-2 rounded-lg outline-none border-none hover:bg-blue-800 self-center duration-200"
          >
            Update Post
          </button>
        </form>
      )}
    </>
  );
};

export default UpdateFoodPostForm;
