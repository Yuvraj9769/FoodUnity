import { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import adminContext from "../store/adminContext";
import { getAllDonorAndRecipients } from "../api/user.api";

const TotalUsersBarChart = () => {
  const { darkMode } = useContext(adminContext);

  const [loadingGraphData, setLoadingGraphData] = useState(true);

  const [data, setData] = useState([{}, {}]);

  // Determine text color based on the current theme
  const textColor = darkMode ? "white" : "black";

  // Bar fill color for dark and light modes
  const barFill = darkMode ? "url(#gradientDark)" : "url(#gradientLight)";

  useEffect(() => {
    getAllDonorAndRecipients()
      .then((response) => {
        const { donorsCount } = response.data[0] || 0;
        const { recipientsCount } = response.data[1] || 0;
        setData([
          { donorsCount: donorsCount },
          { recipientsCount: recipientsCount },
        ]);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoadingGraphData(false);
      });
  }, []);

  console.log(data);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <defs>
          {/* Gradient Definitions */}
          <linearGradient id="gradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#06b6d4", stopOpacity: 1 }}
            />{" "}
            {/* from-cyan-500 */}
            <stop
              offset="100%"
              style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
            />{" "}
            {/* to-blue-600 */}
          </linearGradient>
          <linearGradient id="gradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#0e7490", stopOpacity: 1 }}
            />{" "}
            {/* dark:from-cyan-700 */}
            <stop
              offset="100%"
              style={{ stopColor: "#1e3a8a", stopOpacity: 1 }}
            />{" "}
            {/* dark:to-blue-800 */}
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke={textColor} />
        <YAxis stroke={textColor} />
        <Tooltip
          contentStyle={{
            color: "black",
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
        <Bar dataKey="count" fill={barFill} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TotalUsersBarChart;
