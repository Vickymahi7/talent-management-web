import dayjs from "dayjs";

export function formatDate(date?: Date | null) {
  // "Aug 16, 2018 8:02 PM" or ""
  return date ? dayjs(date).format("MMM D, YYYY h:mm A") : "";
}

export function formatDateMonthYear(date?: Date | string | null) {
  // "Aug 16" or ""
  return date ? dayjs(date).format("MMM YYYY") : "";
}
