import dayjs from "dayjs";
import { DateObject } from "react-multi-date-picker";

export function formatDate(input: string) {
  const [day, month, year] = input.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(month, 10) - 1];
  return `${day} ${monthName} ${year}`;
}

export function formatDatetoString(inputDate: string): string {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear(); // Extract year

  return `${day}-${month}-${year}`;
}

export function formatISODate(input: string | null) {
  if (!input) {
    return "Not confirmed yet";
  }
  const date = new Date(input);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export function convertDateObjectsToStrings(dates: DateObject[]): string[] {
  return dates.map((date) => date.format("DD MMM YYYY"));
}

export function convertDateObjectsToStringArray(dates: DateObject[]): string[] {
  return dates.map((date) => date.format("DD-MM-YYYY"));
}

export function formatDateStrings(dates: string[]): string[] {
  console.log("dates ", dates);
  return dates.map((date) => {
    const dateObj = new DateObject({ date, format: "DD-MM-YYYY" });
    return dateObj.format("DD MMM YYYY");
  });
}

export function transformProposedDates(dates: string): string[] {
  if (!dates) return [];
  return dates.split(",").map((date) => date.trim());
}

export const formatDates = (dates: string[]): string => {
  return dates
    .map((date) => {
      const [day, month, year] = date.split("-");
      return dayjs(`${month}-${day}-${year}`, "MM-DD-YYYY").format(
        "DD MMM YYYY",
      );
    })
    .join(", ");
};

export const formatDateArray = (dates: string[]): string => {
  return dates.join(", ");
};
