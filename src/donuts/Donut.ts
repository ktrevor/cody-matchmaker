import { Group } from "../groups/Group";

export interface Donut {
  id: string;
  name: string;
  date: Date;
  groups: Group[];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const dateFormat = ["ddd, MMM D, YYYY"];
