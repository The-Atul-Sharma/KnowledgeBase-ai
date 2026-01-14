const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;

const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};

export const formatTimestamp = (timestamp, currentTime = new Date()) => {
  const msgTime = new Date(timestamp);
  const diffSeconds = Math.floor((currentTime - msgTime) / 1000);

  if (diffSeconds < SECONDS_PER_MINUTE) {
    return "Just now";
  }

  if (diffSeconds < SECONDS_PER_HOUR) {
    const minutes = Math.floor(diffSeconds / SECONDS_PER_MINUTE);
    return `${minutes} ${pluralize(minutes, "minute", "minutes")} ago`;
  }

  if (diffSeconds < SECONDS_PER_DAY) {
    const hours = Math.floor(diffSeconds / SECONDS_PER_HOUR);
    return `${hours} ${pluralize(hours, "hour", "hours")} ago`;
  }

  return msgTime.toLocaleString();
};
