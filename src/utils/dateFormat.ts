export const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function convertISTDateRangeToUTC(startIST: string, endIST: string) {
  const startDate = new Date(startIST + "T00:00:00+05:30");
  const endDate = new Date(endIST + "T23:59:59+05:30");

  return {
    startUTC: new Date(startDate.toISOString()),
    endUTC: new Date(endDate.toISOString()),
  };
}
