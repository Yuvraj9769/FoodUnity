import { useContext } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import adminContext from "../store/adminContext"; // Adjust the path as needed

const TotalDonorsGaugeChart = () => {
  const { darkMode } = useContext(adminContext);

  // Example data for total donors count
  const data = [
    { name: "Total Donors", value: 850, fill: "url(#gradientFill)" },
  ];

  // Gradient colors based on the theme
  const gradientColors = darkMode
    ? ["#F97316", "#DB2777"] // dark:from-orange-600 to-pink-800
    : ["#FBBF24", "#EC4899"]; // from-orange-500 to-pink-600

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="100%"
        barSize={20}
        data={data}
      >
        <defs>
          <linearGradient id="gradientFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: gradientColors[0], stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: gradientColors[1], stopOpacity: 1 }}
            />
          </linearGradient>
          {/* Gradient for the legend icon */}
          <radialGradient id="legendGradient" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              style={{ stopColor: gradientColors[0], stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: gradientColors[1], stopOpacity: 1 }}
            />
          </radialGradient>
        </defs>

        <RadialBar
          minAngle={15}
          clockWise
          dataKey="value"
          cornerRadius={10}
          fill="url(#gradientFill)"
        />

        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "white" : "black",
            borderRadius: "5px",
            padding: "5px",
          }}
          formatter={(value) => [`${value}`, "Total Donors"]}
        />

        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          wrapperStyle={{
            color: darkMode ? "white" : "black",
            fontWeight: "bold",
          }}
          payload={[
            {
              value: "Total Donors: 850",
              type: "circle",
              color: "url(#legendGradient)",
            },
          ]}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default TotalDonorsGaugeChart;
