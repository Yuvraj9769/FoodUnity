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
import PageLoader from "./PageLoader";
import { useDispatch, useSelector } from "react-redux";
import { setGraphData } from "../features/adminFeatures";

const TotalUsersBarChart = () => {
  const { darkMode } = useContext(adminContext);

  const [loadingGraphData, setLoadingGraphData] = useState(true);

  const graphData = useSelector((state) => state.graphData);

  const dispatch = useDispatch();

  const textColor = darkMode ? "white" : "black";

  const barFill = darkMode ? "url(#gradientDark)" : "url(#gradientLight)";

  useEffect(() => {
    if (Object.keys(graphData[0]).length === 0) {
      getAllDonorAndRecipients()
        .then((response) => {
          const { donorsCount } = response.data[0] || 0;
          const { recipientsCount } = response.data[1] || 0;
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
    }

    if (graphData.lngth !== 0) {
      setLoadingGraphData(false);
    }
  }, []);

  return (
    <>
      {loadingGraphData ? (
        <PageLoader />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={graphData}>
            <defs>
              {/* Gradient Definitions */}
              <linearGradient
                id="gradientLight"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
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
              <linearGradient
                id="gradientDark"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
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
      )}
    </>
  );
};

export default TotalUsersBarChart;
