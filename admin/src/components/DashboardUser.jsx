import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsersData } from "../features/adminFeatures";
import { MdModeEdit } from "react-icons/md";
import { MdFolderDelete } from "react-icons/md";
import { deleteUserAsAdminPrevilage, getAllUsersData } from "../api/user.api";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader";

const DashboardUser = () => {
  const usersData = useSelector((state) => state.usersData);
  const [delId, setDelId] = useState();
  const [loadingData, setLoadingData] = useState(true);

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
        .finally(() => setLoadingData(false));
    }
  }, []);

  return (
    <div className="overflow-y-scroll scroll-smooth scroll-bar-custom grid grid-cols-1 gap-4 p-4">
      {loadingData ? (
        <PageLoader />
      ) : (
        <table className="min-w-full table-auto bg-slate-50 dark:bg-slate-800 text-black dark:text-slate-50">
          <thead className=" bg-slate-300 dark:bg-slate-900">
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
                    {user.role}
                  </p>
                </td>

                <td className="p-2">
                  <MdModeEdit className="bg-green-500 rounded-md p-1 text-3xl cursor-pointer text-slate-50" />
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
      )}
    </div>
  );
};

export default DashboardUser;
