import { Semester } from "../components/JoinedProvider";

export interface Member {
  id: string;
  slackId: string;
  name: string;
  joined: Semester;
  gender: "Male" | "Female" | "Non-binary" | "Other";
  grade: "Freshman" | "Sophomore" | "Junior" | "Senior";
  forest: string;
  treeId: string | null;
  groupIds: string[];
}

export const getNextGrade = (
  currentGrade: "Freshman" | "Sophomore" | "Junior" | "Senior"
) => {
  const grades = ["Freshman", "Sophmore", "Junior", "Senior"];
  const currentIndex = grades.indexOf(currentGrade);
  if (currentIndex === grades.length - 1) {
    return null;
  }
  return grades[currentIndex + 1];
};
