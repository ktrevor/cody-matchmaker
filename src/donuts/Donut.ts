export interface Donut {
  id: string;
  name: string;
  date: Date;
  groupIds: string[];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
