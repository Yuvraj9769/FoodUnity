import { useContext } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import adminContext from "../store/adminContext"; // Adjust the path as needed

const TotalDonorsPieChart = () => {
  const { darkMode } = useContext(adminContext);

  // Sample data for total donors
  const data = [
    { name: "Individual Donors", value: 400 },
    { name: "Corporate Donors", value: 300 },
    { name: "Foundation Donors", value: 300 },
    { name: "Government Grants", value: 200 },
  ];

  // Gradient colors based on the theme
  const gradientColors = darkMode
    ? ["#F97316", "#D946EF"] // dark:from-orange-600 to-pink-800
    : ["#FBBF24", "#EC4899"]; // from-orange-500 to-pink-600

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <defs>
          {/* Gradient Definitions */}
          <linearGradient id="gradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: gradientColors[0], stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: gradientColors[1], stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient id="gradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: gradientColors[0], stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: gradientColors[1], stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="url(#gradientLight)" // Use the gradient fill
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#gradientLight)`} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TotalDonorsPieChart;
