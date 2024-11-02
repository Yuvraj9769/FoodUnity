import { useContext, useEffect, useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts";
import PageLoader from "./PageLoader";
import adminContext from "../store/adminContext";
import { requestPendingPosts } from "../api/food.api";
import toast from "react-hot-toast";

const RequestedPendingPostsHistogram = () => {
  const [loading, setLoading] = useState(true);

  const { darkMode } = useContext(adminContext);

  const textColor = darkMode ? "white" : "black";

  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    if (lineChartData.length === 0 || !lineChartData) {
      requestPendingPosts()
        .then((data) => {
          setLineChartData(data);
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setLoading(false));
    }

    if (lineChartData.length !== 0) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke={textColor} dataKey="monthName" />
            <YAxis stroke={textColor} />
            <Tooltip
              formatter={(value) => [`${value} Pending Requests Posts`]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar dataKey="count" fill="rgba(15, 211, 218, 0.8)" />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default RequestedPendingPostsHistogram;
