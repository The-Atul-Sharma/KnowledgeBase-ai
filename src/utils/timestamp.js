export const formatTimestamp = (timestamp, currentTime = new Date()) => {
  const msgTime = new Date(timestamp);
  const diffSeconds = Math.floor((currentTime - msgTime) / 1000);

  if (diffSeconds < 60) {
    return "Just now";
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    return msgTime.toLocaleString();
  }
};

