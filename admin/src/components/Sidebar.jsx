// src/components/Sidebar.js

const Sidebar = () => {
  return (
    <aside className="bg-gray-200 dark:bg-gray-900 w-64 min-h-screen p-4 border-r border-r-gray-500">
      <ul className="space-y-2">
        <li>
          <a
            href="#"
            className="block text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded"
          >
            Users
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded"
          >
            Posts
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded"
          >
            Analytics
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded"
          >
            Settings
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
