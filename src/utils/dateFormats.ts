import dayjs from "dayjs";

export function formatDate(date?: Date) {
  // "Aug 16, 2018 8:02 PM" or ""
  return date ? dayjs(date).format("MMM D, YYYY h:mm A") : "";
}
