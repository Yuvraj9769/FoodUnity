const calculateTimeDifferenceString = (createdAt) => {
  const postCreatedAt = createdAt ? new Date(createdAt).getTime() : null;
  const currentTime = Date.now();
  let timeDifferenceString = "";

  if (postCreatedAt !== null) {
    const timeDifference = currentTime - postCreatedAt; // in milliseconds
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(minutesDifference / 60);
    const remainingMinutes = minutesDifference % 60;

    if (hoursDifference > 0) {
      timeDifferenceString += `${hoursDifference} hr${
        hoursDifference > 1 ? "s" : ""
      } `;
    }

    timeDifferenceString += `${remainingMinutes} min${
      remainingMinutes !== 1 ? "s" : ""
    } `;
  }

  return timeDifferenceString.trim();
};

export default calculateTimeDifferenceString;
