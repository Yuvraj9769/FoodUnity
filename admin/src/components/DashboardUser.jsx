import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedData, setUsersData } from "../features/adminFeatures";
import { MdModeEdit } from "react-icons/md";
import { MdFolderDelete } from "react-icons/md";
import {
  deleteUserAsAdminPrevilage,
  getAllUsersData,
  searchUserForAdmin,
} from "../api/user.api";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader";
import { Link } from "react-router-dom";

const DashboardUser = () => {
  const usersData = useSelector((state) => state.usersData);
  const searchedData = useSelector((state) => state.searchedData);

  const [delId, setDelId] = useState();
  const [loadingData, setLoadingData] = useState(true);

  const [searchData, setSearchData] = useState({
    searchQuery: "",
  });

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (searchedData.length !== 0 && value === "") {
      dispatch(setSearchedData([]));
    }
    setSearchData((preData) => ({ ...preData, searchQuery: value }));
  };

  const checkKey = async (e) => {
    if (
      e.key === "Enter" &&
      location.pathname === "/users-admin" &&
      searchData.searchQuery.trim() !== ""
    ) {
      try {
        setLoadingData(true);
        const res = await searchUserForAdmin(searchData);
        dispatch(setSearchedData(res.data));
      } catch (error) {
        setSearchData({
          searchQuery: "",
        });
        toast.error(error.message);
      } finally {
        setLoadingData(false);
      }
    }
  };

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";

  const [confDelete, setConfDelete] = useState(false);

  const dispatch = useDispatch();

  const deleteUser = async () => {
    try {
      const res = await deleteUserAsAdminPrevilage(delId);
      toast.success(res.message);
      dispatch(setUsersData(res.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setConfDelete(false);
    }
  };

  const getDeletUserId = (id) => {
    setDelId(id);
    setConfDelete(true);
  };

  useEffect(() => {
    if (usersData?.length === 0 || !usersData) {
      getAllUsersData()
        .then((data) => {
          dispatch(setUsersData(data));
        })
        .catch((error) => toast.error(error.message))
        .finally(() => {
          setLoadingData(false);
        });
    }

    if (usersData.length !== 0) {
      setLoadingData(false);
    }
  }, []);

  return (
    <div className="overflow-y-scroll scroll-smooth scroll-bar-custom grid grid-cols-1 gap-4 p-4">
      <div className="w-full flex items-center justify-center p-4 lg:py-6 gap-4 flex-wrap lg:flex-nowrap">
        <div className="gap-3 w-full inline-flex mt-2 lg:mt-0 items-center justify-center text-black rounded-md pr-2">
          <input
            type="text"
            value={searchData.searchQuery}
            onChange={handleOnChange}
            onKeyDown={checkKey}
            placeholder="Search username/email"
            className="p-2 rounded-md border-none outline-none w-[85%] lg:w-[45%] dark:bg-slate-800 duration-500  bg-slate-200 focus-within:ring-1 dark:focus-within:ring-blue-500 focus-within:ring-black group dark:text-slate-50 text-black"
          />
        </div>
      </div>
      {loadingData ? (
        <PageLoader />
      ) : searchedData.length !== 0 ? (
        <table className="min-w-full table-auto bg-slate-50 rounded-md dark:bg-slate-800 text-black dark:text-slate-50">
          <thead className="border-b border-b-gray-500">
            <tr>
              <th className="p-2 text-left">User Image</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Edit</th>
              <th className="p-2 text-left">Delete</th>
            </tr>
          </thead>

          <tbody>
            {searchedData.map((user, index) => (
              <tr
                className="hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
                key={index}
              >
                <td className="p-2 text-center">
                  <img
                    src={user?.profilePic || defaultImage}
                    alt="user image"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="p-2">
                  <h3 className="p-1 max-w-[220px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {user.username}
                  </h3>
                </td>
                <td className="p-2">
                  <p className="p-1 max-w-[220px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {user.email}
                  </p>
                </td>
                <td className="p-2">
                  <p className="p-1 max-w-[220px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {user.role.charAt(0).toUpperCase() +
                      user.role.slice(1).toLowerCase()}
                  </p>
                </td>

                <td className="p-2">
                  <Link to={`/user-update-data/${index}`}>
                    <MdModeEdit className="bg-green-500 rounded-md p-1 text-3xl cursor-pointer text-slate-50" />
                  </Link>
                </td>
                <td className="p-2" onClick={() => getDeletUserId(user._id)}>
                  <MdFolderDelete className="bg-red-600 rounded-md p-1 text-3xl cursor-pointer text-slate-50" />
                </td>

                <td>
                  {/* Delete confirmation component */}
                  {confDelete && delId === user._id && (
                    <div className="bg-transparent flex items-center justify-center fixed top-0 left-0 w-screen h-screen before:bg-black before:opacity-70 before:w-screen before:h-screen before:absolute before:z-20 before:left-0 before:top-0">
                      <div className="inline-flex flex-col items-center gap-5 bg-slate-50 p-4 rounded-lg relative z-30 lg:max-w-[540px]">
                        <p className="text-xl font-semibold text-red-600 text-center">
                          Are you sure you want to permanently delete{" "}
                          {user.username}?
                        </p>
                        <div className="inline-flex items-center mt-2 w-full justify-around">
                          <button
                            className="px-4 py-2 shadow-md shadow-black rounded-md border-none outline-none text-slate-50 text-lg bg-green-500"
                            onClick={deleteUser}
                          >
                            Yes
                          </button>
                          <button
                            className="px-4 py-2 shadow-md shadow-black rounded-md border-none outline-none text-slate-50 text-lg bg-red-500"
                            onClick={() => setConfDelete(!confDelete)}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        usersData.length !== 0 && (
          <table className="min-w-full table-auto bg-slate-50 rounded-md dark:bg-slate-800 text-black dark:text-slate-50">
            <thead className="border-b border-b-gray-500">
              <tr>
                <th className="p-2 text-left">User Image</th>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Edit</th>
                <th className="p-2 text-left">Delete</th>
              </tr>
            </thead>

            <tbody>
              {usersData.map((user, index) => (
                <tr
                  className="hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
                  key={index}
                >
                  <td className="p-2 text-center">
                    <img
                      src={user?.profilePic || defaultImage}
                      alt="user image"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="p-2">
                    <h3 className="p-1 max-w-[220px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {user.username}
                    </h3>
                  </td>
                  <td className="p-2">
                    <p className="p-1 max-w-[220px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {user.email}
                    </p>
                  </td>
                  <td className="p-2">
                    <p className="p-1 max-w-[220px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {user.role.charAt(0).toUpperCase() +
                        user.role.slice(1).toLowerCase()}
                    </p>
                  </td>

                  <td className="p-2">
                    <Link to={`/user-update-data/${index}`}>
                      <MdModeEdit className="bg-green-500 rounded-md p-1 text-3xl cursor-pointer text-slate-50" />
                    </Link>
                  </td>
                  <td className="p-2" onClick={() => getDeletUserId(user._id)}>
                    <MdFolderDelete className="bg-red-600 rounded-md p-1 text-3xl cursor-pointer text-slate-50" />
                  </td>

                  <td>
                    {/* Delete confirmation component */}
                    {confDelete && delId === user._id && (
                      <div className="bg-transparent flex items-center justify-center fixed top-0 left-0 w-screen h-screen before:bg-black before:opacity-70 before:w-screen before:h-screen before:absolute before:z-20 before:left-0 before:top-0">
                        <div className="inline-flex flex-col items-center gap-5 bg-slate-50 p-4 rounded-lg relative z-30 lg:max-w-[540px]">
                          <p className="text-xl font-semibold text-red-600 text-center">
                            Are you sure you want to permanently delete{" "}
                            {user.username}?
                          </p>
                          <div className="inline-flex items-center mt-2 w-full justify-around">
                            <button
                              className="px-4 py-2 shadow-md shadow-black rounded-md border-none outline-none text-slate-50 text-lg bg-green-500"
                              onClick={deleteUser}
                            >
                              Yes
                            </button>
                            <button
                              className="px-4 py-2 shadow-md shadow-black rounded-md border-none outline-none text-slate-50 text-lg bg-red-500"
                              onClick={() => setConfDelete(!confDelete)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default DashboardUser;
