export const calculateArrivalStatus = (
  totalArrival: number,
  normalArrival: number
) => {
  if (!totalArrival || !normalArrival || normalArrival === 0) {
    return "";
  }

  const percentageDifference =
    ((totalArrival - normalArrival) / normalArrival) * 100;

  if (percentageDifference > 10) {
    return "High";
  } else if (percentageDifference < -10) {
    return "Low";
  } else {
    return "Normal";
  }
};
