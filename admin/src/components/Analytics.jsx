import DeliveriesScatterPlot from "./DeliveriesBarChart";
import RequestedPendingPostsHistogram from "./RequestedPendingPostsHistogram";
import TotalDonorsGaugeChart from "./TotalDonorsGaugeChart";
import TotalPostsLineChart from "./TotalPostsLineChart";
import TotalRecipientsRadialBarChart from "./TotalRecipientsRadialBarChart";
import TotalUsersBarChart from "./TotalUsersBarChart";

const Analytics = () => {
  return (
    <div className="p-2 grid grid-cols-1 lg:grid-cols-2 overflow-y-scroll gap-3 scroll-smooth scroll-bar-custom">
      <TotalUsersBarChart />
      <RequestedPendingPostsHistogram />
      <TotalPostsLineChart />
      <TotalDonorsGaugeChart />
      <TotalRecipientsRadialBarChart />
      <DeliveriesScatterPlot />
    </div>
  );
};

export default Analytics;
