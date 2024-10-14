import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUserFeedback } from "../api/feedbackdApi";
import PageLoader from "./PageLoader";

const FeedbackForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (
      [formData.comments, formData.name].some((field) => field.trim() === "")
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await getUserFeedback(formData);
      if (res.statusCode === 200 && res.success) {
        toast.success(res.message);
        setFormData({ name: "", email: "", rating: "", comments: "" });
        setTimeout(() => {
          navigate("/");
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="flex items-center justify-center w-screen lg:w-[450px]">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">
              Feedback Form
            </h2>

            <div className="mb-4">
              <label
                className="block text-black font-semibold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-black font-semibold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-black font-semibold mb-2"
                htmlFor="rating"
              >
                Rating
              </label>
              <select
                name="rating"
                required
                value={formData.rating}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select rating</option>
                <option value="5">Excellent</option>
                <option value="4">Good</option>
                <option value="3">Average</option>
                <option value="2">Poor</option>
                <option value="1">Very Poor</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                className="block text-black font-semibold mb-2"
                htmlFor="comments"
              >
                Comments
              </label>
              <textarea
                name="comments"
                required
                value={formData.comments}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                placeholder="Enter your comments"
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FeedbackForm;
