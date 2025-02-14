import { Group } from "../groups/Group";
import dayjs from "dayjs";

export interface Donut {
  id: string;
  name: string;
  date: Date;
  groups: Group[];
  sent: boolean;
}

export function formatDate(date: Date): string {
  return dayjs(date).format("ddd, MMM D, YYYY");
}

export const dateFormat = ["ddd, MMM D, YYYY"];
