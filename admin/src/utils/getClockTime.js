const getClockTime = (time) => {
  const [hour, minute] = time.split(":");
  let hourInt = parseInt(hour, 10); //converts the string hour into an integer using the decimal (base-10) numeral system.
  const ampm = hourInt >= 12 ? "PM" : "AM";
  hourInt = hourInt % 12 || 12;
  return `${hourInt}:${minute} ${ampm}`;
};

export default getClockTime;
