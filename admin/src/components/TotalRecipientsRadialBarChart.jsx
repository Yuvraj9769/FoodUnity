import { useContext, useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  Legend,
  Tooltip,
} from "recharts";
import adminContext from "../store/adminContext";
import { getAllDonorAndRecipients } from "../api/user.api";
import { setGraphData } from "../features/adminFeatures";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "./PageLoader";

const TotalRecipientsRadialBarChart = () => {
  const { darkMode } = useContext(adminContext);

  const [loadingGraphData, setLoadingGraphData] = useState(true);

  const graphData = useSelector((state) => state.graphData);

  const dispatch = useDispatch();

  const data = [
    {
      name: "Total Recipients",
      count: graphData[1].count,
      fill: "url(#recipientGradient)",
    },
  ];

  const textColor = darkMode ? "white" : "black";

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
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <defs>
              <linearGradient
                id="recipientGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{
                    stopColor: darkMode ? "#7c3aed" : "#a855f7",
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset="100%"
                  style={{
                    stopColor: darkMode ? "#4338ca" : "#6366f1",
                    stopOpacity: 1,
                  }}
                />
              </linearGradient>
            </defs>
            <PolarAngleAxis
              type="number"
              domain={[0, 1500]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={15}
              clockWise
              dataKey="count"
              fill="url(#recipientGradient)"
              label={{ position: "insideEnd", fill: textColor }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: darkMode ? "#333" : "#fff",
                color: textColor,
                borderRadius: "5px",
              }}
              formatter={(value) => [`${value}`, "Total Recipients"]}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "20px", fontWeight: "bold", fill: textColor }}
            >
              {data[0].count || 0}
            </text>
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                color: textColor,
                fontSize: "14px",
                fontWeight: "bold",
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default TotalRecipientsRadialBarChart;
