import { useContext, useEffect, useState } from "react";
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
import adminContext from "../store/adminContext";
import { getAllFoodPostsMonthWise } from "../api/food.api";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "./PageLoader";
import { setLineChartGraphData } from "../features/adminFeatures";
import toast from "react-hot-toast";

const TotalPostsLineChart = () => {
  const { darkMode } = useContext(adminContext);
  const [lineChartLoader, setLineChartLoader] = useState(true);

  const dispatch = useDispatch();

  const lineChartGraphData = useSelector((state) => state.lineChartGraphData);

  const textColor = darkMode ? "white" : "black";

  const lineColor = darkMode ? "#4ade80" : "#84cc16";

  useEffect(() => {
    if (lineChartGraphData.length === 0 || !lineChartGraphData) {
      getAllFoodPostsMonthWise()
        .then((data) => {
          dispatch(setLineChartGraphData(data));
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setLineChartLoader(false));
    }

    if (lineChartGraphData.length !== 0) {
      setLineChartLoader(false);
    }
  }, [lineChartGraphData]);

  return (
    <>
      {lineChartLoader ? (
        <PageLoader />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineChartGraphData}>
            <defs>
              <linearGradient
                id="gradientLight"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#84cc16", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#4ade80", stopOpacity: 1 }}
                />
              </linearGradient>
              <linearGradient
                id="gradientDark"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#4ade80", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#1e3a8a", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip
              contentStyle={{
                color: textColor,
              }}
            />
            <Legend wrapperStyle={{ color: textColor }} />

            <Line
              type="monotone"
              dataKey="count"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ stroke: lineColor, fill: lineColor }}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default TotalPostsLineChart;
