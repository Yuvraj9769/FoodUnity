import { useContext, useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import adminContext from "../store/adminContext"; // Adjust the path as needed
import { useDispatch, useSelector } from "react-redux";
import { getAllDonorAndRecipients } from "../api/user.api";
import { setGraphData } from "../features/adminFeatures";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader";

const TotalDonorsGaugeChart = () => {
  const { darkMode } = useContext(adminContext);
  const [loadingGraphData, setLoadingGraphData] = useState(true);
  const graphData = useSelector((state) => state.graphData);
  const dispatch = useDispatch();

  const data = [{ name: "Total Donors", value: graphData[0]?.count || 0 }];

  // Gradient colors based on the theme
  const gradientColors = darkMode
    ? ["#F97316", "#DB2777"] // dark:from-orange-600 to-pink-800
    : ["#FBBF24", "#EC4899"]; // from-orange-500 to-pink-600

  useEffect(() => {
    if (Object.keys(graphData[0]).length === 0) {
      getAllDonorAndRecipients()
        .then((response) => {
          const donorsCount = response.data[0]?.donorsCount || 0;
          const recipientsCount = response.data[1]?.recipientsCount || 0;
          dispatch(
            setGraphData([
              { name: "Donors", count: donorsCount },
              { name: "Recipients", count: recipientsCount },
            ])
          );
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setLoadingGraphData(false);
        });
    } else {
      setLoadingGraphData(false);
    }
  }, [graphData, dispatch]);

  return (
    <>
      {loadingGraphData ? (
        <PageLoader />
      ) : (
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
              <linearGradient
                id="gradientFill"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
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
                  value: `Total Donors: ${graphData[0]?.count || 0}`, // Update to show dynamic count
                  type: "circle",
                  color: "url(#legendGradient)",
                },
              ]}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default TotalDonorsGaugeChart;
