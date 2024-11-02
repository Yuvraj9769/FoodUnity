import { Chart, registerables } from "chart.js";
import { useContext, useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveredPosts } from "../api/food.api";
import { setBarChartGraphData } from "../features/adminFeatures";
import PageLoader from "./PageLoader";
import toast from "react-hot-toast";
import adminContext from "../store/adminContext";

Chart.register(...registerables); // Register necessary components

const DeliveriesScatterPlot = () => {
  const dispatch = useDispatch();

  const { darkMode } = useContext(adminContext);

  const barChartGraphData = useSelector((state) => state.barChartGraphData);

  const [graphDataLoader, setGraphDataLoader] = useState(true);

  const textColor = darkMode ? "white" : "black";

  useEffect(() => {
    if (barChartGraphData.length === 0 || !barChartGraphData) {
      getDeliveredPosts()
        .then((data) => {
          dispatch(setBarChartGraphData(data));
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setGraphDataLoader(false));
    }

    if (barChartGraphData.length !== 0) {
      setGraphDataLoader(false);
    }
  }, []);

  return (
    <>
      {graphDataLoader ? (
        <PageLoader />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="monthName" name="Month" stroke={textColor} />
            <YAxis
              dataKey="count"
              name="Number of Deliveries"
              stroke={textColor}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
              name="Deliveries"
              data={barChartGraphData}
              fill="rgba(255, 98, 0, 0.8)"
            />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default DeliveriesScatterPlot;
