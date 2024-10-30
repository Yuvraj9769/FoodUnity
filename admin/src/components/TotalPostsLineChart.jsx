import { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import adminContext from "../store/adminContext"; // Adjust the path as needed

const TotalPostsLineChart = () => {
  const { darkMode } = useContext(adminContext);

  // Sample data for total posts
  const data = [
    { name: "Week 1", postsCreated: 300 },
    { name: "Week 2", postsCreated: 600 },
    { name: "Week 3", postsCreated: 400 },
    { name: "Week 4", postsCreated: 900 },
    { name: "Week 5", postsCreated: 1000 },
  ];

  // Determine text color based on the current theme
  const textColor = darkMode ? "white" : "black";

  // Line color for dark and light modes
  const lineColor = darkMode ? "#4ade80" : "#84cc16"; // Adjust line color

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <defs>
          {/* Gradient Definitions */}
          <linearGradient id="gradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#84cc16", stopOpacity: 1 }}
            />{" "}
            {/* from-lime-500 */}
            <stop
              offset="100%"
              style={{ stopColor: "#4ade80", stopOpacity: 1 }}
            />{" "}
            {/* to-green-600 */}
          </linearGradient>
          <linearGradient id="gradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#4ade80", stopOpacity: 1 }}
            />{" "}
            {/* dark:from-lime-600 */}
            <stop
              offset="100%"
              style={{ stopColor: "#1e3a8a", stopOpacity: 1 }}
            />{" "}
            {/* dark:to-green-800 */}
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke={textColor} />
        <YAxis stroke={textColor} />
        <Tooltip
          contentStyle={{
            color: textColor, // Text color according to theme
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />

        <Line
          type="monotone"
          dataKey="postsCreated"
          stroke={lineColor}
          strokeWidth={2}
          dot={{ stroke: lineColor, fill: lineColor }} // Color for the dot
          activeDot={{ r: 8 }} // Increase the size of the active dot
          isAnimationActive={false} // Disable animation for smoother rendering
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TotalPostsLineChart;
