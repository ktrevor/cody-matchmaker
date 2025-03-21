import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getMembers } from "../members/firebaseMemberFunctions";

export const makeGroups = async (donutId: string): Promise<String[]> => {
  const groupIds: String[] = [];
  const groupSize = 3;
  const members = await getMembers();

  const groupCollection = collection(db, "groups");

  for (let i = 0; i < members.length; i += groupSize) {
    const groupMembers = members.slice(i, i + groupSize);

    const groupDoc = await addDoc(groupCollection, {
      donutId: donutId,
      memberIds: groupMembers.map((member) => member.id),
    });

    groupIds.push(groupDoc.id);
  }

  return groupIds;
};
