const getJustMinutes = (time) => {
  if (time.includes("hrs")) {
    return false;
  } else {
    const checkMin = time.split("mins")[0];
    return checkMin > 10 ? false : true;
  }
};

export default getJustMinutes;
