import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userData = useSelector((state) => state.userData);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative rounded-md">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to FoodUnity</h1>
        <p className="mb-4">
          FoodUnity is your platform to bridge the gap between surplus food and
          those in need. Whether you have excess food to share or are looking
          for support, FoodUnity connects communities to reduce food waste and
          fight hunger together.
        </p>

        <h2 className="text-2xl font-bold mb-4">Key Features:</h2>
        <ul className="mb-4 grid grid-cols-1 gap-4">
          <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex flex-col gap-2 shadow-md">
            <strong className="text-xl dark:text-slate-50 text-black">
              Donation Listings:
            </strong>
            <ul className="list-disc list-inside">
              <li>
                Post surplus food items from individuals, restaurants, or
                grocery stores for donation.
              </li>
              <li>
                Users in need can search and request available food items in
                their local area.
              </li>
              <li>Donor can delete and create posts.</li>
              <li>
                Donor can update their post within 10 minutes by uploading it
                again.
              </li>
            </ul>
          </li>
          <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex flex-col gap-2 shadow-md">
            <strong className="text-xl dark:text-slate-50 text-black">
              Community Support:
            </strong>
            <ul className="list-disc list-inside">
              <li>
                Foster community engagement and support through food sharing
                initiatives.
              </li>
              <li>
                Collaborate with local organizations to expand outreach and
                impact.
              </li>
            </ul>
          </li>
          <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex flex-col gap-2 shadow-md">
            <strong className="text-xl dark:text-slate-50 text-black">
              User-friendly Interface:
            </strong>
            <ul className="list-disc list-inside">
              <li>
                Intuitive platform design ensures easy navigation and
                interaction.
              </li>
              <li>Seamless experience for both food donors and recipients.</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-bold my-5">How It Works:</h2>
        <ol className="flex flex-col gap-4">
          <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex flex-col gap-2 shadow-md">
            <b>Post Food Listings:</b> Share details about surplus food items
            you wish to donate.
          </li>
          <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex flex-col gap-2 shadow-md">
            <b>Search and Request:</b> Browse available food listings and
            request items based on your needs.
          </li>
          <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex flex-col gap-2 shadow-md">
            <b>Connect and Coordinate:</b> Coordinate with donors or recipients
            to arrange for food collection or delivery.
          </li>
        </ol>

        <p className="my-5">
          Join FoodUnity today and be a part of our mission to make a difference
          by sharing food resources and supporting those in need in your
          community.
        </p>
      </div>
      {isLoggedIn && userData.role === "donor" && (
        <Link to="/doPost">
          <button className="text-slate-50 text-lg bg-blue-700 px-4 py-2 rounded-lg outline-none border-none hover:bg-blue-800 self-center duration-200 inline-flex items-center gap-2 absolute top-3 right-8">
            <IoMdAdd /> Create
          </button>
        </Link>
      )}
    </div>
  );
};

export default Home;
