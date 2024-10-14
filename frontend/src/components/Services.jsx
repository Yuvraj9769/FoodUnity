import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const Services = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen relative">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Services Offered</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Individual Donations</h2>
            <p className="text-base dark:text-gray-300">
              Post individual surplus food items for donation securely.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Restaurant Donations</h2>
            <p className="text-base dark:text-gray-300">
              Restaurants can donate excess food items securely and
              conveniently.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Grocery Store Donations</h2>
            <p className="text-base dark:text-gray-300">
              Grocery stores can securely donate surplus food stock.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Local Community Support</h2>
            <p className="text-base dark:text-gray-300">
              Engage local communities securely in supporting food sharing
              initiatives.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Request Food Items</h2>
            <p className="text-base dark:text-gray-300">
              Users in need can securely search and request available food
              items.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Coordinate Pickups</h2>
            <p className="text-base dark:text-gray-300">
              Coordinate securely with donors for food item pickups.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Why Choose Food Unity?</h2>
          <ul className="list-disc list-inside text-base">
            <li className="mb-2">
              Secure platform ensuring privacy and data protection.
            </li>
            <li className="mb-2">
              User-friendly interface for seamless navigation and interaction.
            </li>
            <li className="mb-2">
              Comprehensive community support connecting donors and recipients.
            </li>
            <li className="mb-2">Transparent donation process.</li>
            <li className="mb-2">
              Sustainable solution reducing food waste and supporting local
              communities.
            </li>
            <li className="mb-2">
              Responsive customer support ensuring a positive user experience.
            </li>
          </ul>
        </div>
      </div>
      {isLoggedIn && secureLocalStorage.getItem("donor") && (
        <Link
          to="/doPost"
          className="text-slate-50 text-lg bg-blue-700 px-4 py-2 rounded-lg outline-none border-none hover:bg-blue-800 self-center duration-200 inline-flex items-center gap-2 absolute top-3 right-8"
        >
          <IoMdAdd /> Create
        </Link>
      )}
    </div>
  );
};

export default Services;
