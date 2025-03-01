import { Member } from "../members/Member";

export interface Group {
  id: string;
  donutId: string;
  members: Member[];
}
