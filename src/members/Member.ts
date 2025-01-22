export type Semester = `${"Fall" | "Spring"} ${number}`;

export interface Member {
  id: string;
  name: string;
  joined: Semester;
  gender: "Male" | "Female" | "Non-binary" | "Other";
  grade: "Freshman" | "Sophomore" | "Junior" | "Senior";
  forest:
    | "Lost in the Woods"
    | "Ragtag"
    | "Magic Tree House"
    | "Howl's Moving Forest"
    | "Onlyfamilia";
  treeId: string | null;
}
