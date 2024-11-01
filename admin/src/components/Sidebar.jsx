import { NavLink } from "react-router-dom";
import { setSearchedData } from "../features/adminFeatures";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();

  return (
    <aside className="bg-gray-200 dark:bg-gray-900 w-64 min-h-screen p-4 border-r border-r-gray-500">
      <ul className="space-y-2">
        <li onClick={() => dispatch(setSearchedData([]))}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:dark:from-cyan-700 hover:dark:to-blue-800 ${
                isActive &&
                "bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-700 dark:to-blue-800"
              } `
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li onClick={() => dispatch(setSearchedData([]))}>
          <NavLink
            to="/users-admin"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-lime-500 to-green-600 hover:dark:from-lime-600 hover:dark:to-green-800 ${
                isActive &&
                "bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-600 dark:to-green-800"
              } `
            }
          >
            Users
          </NavLink>
        </li>
        <li onClick={() => dispatch(setSearchedData([]))}>
          <NavLink
            to="/users-posts-admin"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-orange-500 to-pink-600 hover:dark:from-orange-600 hover:dark:to-pink-800 ${
                isActive &&
                "bg-gradient-to-r from-orange-500 to-pink-600 dark:from-orange-600 dark:to-pink-800"
              } `
            }
          >
            Posts
          </NavLink>
        </li>
        <li onClick={() => dispatch(setSearchedData([]))}>
          <NavLink
            to="/admin-analytics"
            className={({ isActive }) =>
              `block text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gradient-to-r from-purple-500 to-indigo-600 hover:dark:from-purple-700 hover:dark:to-indigo-800 ${
                isActive &&
                "bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800"
              } `
            }
          >
            Analytics
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
