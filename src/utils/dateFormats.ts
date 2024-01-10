import dayjs from "dayjs";

export function formatDateTime(date?: Date | null) {
  // "16 Aug, 2018 8:02 PM" or ""
  return date ? dayjs(date).format("DD MMM, YYYY h:mm A") : "";
}

export function formatDate(date?: Date | null) {
  // "16 Aug, 2018" or ""
  return date ? dayjs(date).format("DD MMM, YYYY") : "";
}

export function formatDateMonthYear(date?: Date | string | null) {
  // "Aug 16" or ""
  return date ? dayjs(date).format("MMM YYYY") : "";
}
