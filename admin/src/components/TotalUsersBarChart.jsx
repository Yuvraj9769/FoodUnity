import { useContext } from "react";
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
import adminContext from "../store/adminContext"; // Adjust the path as needed

const TotalUsersBarChart = () => {
  const { darkMode } = useContext(adminContext);
  const data = [
    { name: "Users", count: 1200 },
    { name: "Remaining", count: 800 },
  ];

  // Determine text color based on the current theme
  const textColor = darkMode ? "white" : "black";

  // Bar fill color for dark and light modes
  const barFill = darkMode ? "url(#gradientDark)" : "url(#gradientLight)";

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
