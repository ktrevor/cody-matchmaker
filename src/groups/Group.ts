import { Member } from "../members/Member";

export interface Group {
  id: string;
  name: string;
  members: Member[];
}
