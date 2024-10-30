import CountUp from "react-countup";

import TotalUsersBarChart from "../components/TotalUsersBarChart";
import TotalPostsLineChart from "./TotalPostsLineChart";
import TotalDonorsPieChart from "./TotalDonorsPieChart";

const MainDashboard = () => {
  return (
    <main className="flex-1 p-6 overflow-y-scroll scroll-smooth scroll-bar-custom">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Welcome to the Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-700 dark:to-blue-800 p-4 rounded shadow text-white">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl font-semibold">
            <CountUp start={0} end={1200} duration={5} />
          </p>
        </div>

        <div className="bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-600 dark:to-green-800 p-4 rounded shadow text-white">
          <h2 className="text-xl font-bold">Total Posts</h2>
          <p className="text-3xl font-semibold">
            <CountUp start={0} end={320} duration={5} />
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-pink-600 dark:from-orange-600 dark:to-pink-800 p-4 rounded shadow text-white">
          <h2 className="text-xl font-bold">Total Donors</h2>
          <p className="text-3xl font-semibold">
            <CountUp start={0} end={55} duration={5} />
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 p-4 rounded shadow text-white">
          <h2 className="text-xl font-bold">Total Recipients</h2>
          <p className="text-3xl font-semibold">
            <CountUp start={0} end={150} duration={5} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Users</h2>
          <TotalUsersBarChart />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Posts</h2>
          <TotalPostsLineChart />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Donors</h2>
          <TotalDonorsPieChart />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Recipients</h2>
          {/* <TotalRecipientsDoughnutChart /> */}
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;
