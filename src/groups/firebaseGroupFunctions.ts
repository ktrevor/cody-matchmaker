import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Member } from "../members/Member";
import { Group } from "./Group";
import { getMemberById } from "../members/firebaseMemberFunctions";

export const getGroupById = async (groupId: string): Promise<Group> => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error(`Group with ID ${groupId} not found`);
  }

  const groupData = groupSnap.data();

  const members: Member[] = await Promise.all(
    groupData.memberIds.map((memberId: string) => getMemberById(memberId))
  );

  return {
    id: groupId,
    members: members,
  } as Group;
};
