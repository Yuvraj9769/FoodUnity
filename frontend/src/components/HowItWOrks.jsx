import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";

const HowItWorks = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen relative">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">How It Works</h1>

        <div className="grid grid-cols-1 w-full md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Post Food Donations</h2>
            <p className="text-sm dark:text-gray-300">
              Individuals, restaurants, and grocery stores can securely post
              surplus food items for donation.
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Request Food Items</h2>
            <p className="text-sm dark:text-gray-300">
              Users in need can search for and request available food items in
              their local area.
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Coordinate Pickup</h2>
            <p className="text-sm dark:text-gray-300">
              Arrange secure pickups of donated food items from donors to
              recipients.
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Community Engagement</h2>
            <p className="text-sm dark:text-gray-300">
              Engage local communities in supporting and participating in food
              sharing initiatives.
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">User Profiles</h2>
            <p className="text-sm dark:text-gray-300">
              Create profiles for donors and recipients to manage donations and
              requests.
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Feedback and Reviews</h2>
            <p className="text-sm dark:text-gray-300">
              Provide feedback and reviews to ensure transparency and
              accountability.
            </p>
          </div>
        </div>
      </div>
      {isLoggedIn && (
        <button className="text-slate-50 text-lg bg-blue-700 px-4 py-2 rounded-lg outline-none border-none hover:bg-blue-800 self-center duration-200 inline-flex items-center gap-2 absolute top-3 right-8">
          <IoMdAdd /> Create
        </button>
      )}
    </div>
  );
};

export default HowItWorks;
