export type Semester = `${"Fall" | "Spring"} ${number}`;

export interface Member {
  name: string;
  joined: Semester;
  gender: "Male" | "Female" | "Non-binary" | "Other";
  grade: "Freshman" | "Sophomore" | "Junior" | "Senior" | "Super Senior";
  forest:
    | "Lost in the Woods"
    | "Ragtag"
    | "Magic Tree House"
    | "Howl's Moving Forest"
    | "Onlyfamilia";
  tree?: Member;
  leaves?: Member[];
}
