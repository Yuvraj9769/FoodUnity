import moment from "moment";

const getClockTime = (time) => {
  // Parse the time as UTC and then format it to 12-hour clock with AM/PM
  const formattedTime = moment(time).utc().format("hh:mm A");

  return formattedTime; // Return the formatted time string
};

export default getClockTime;
