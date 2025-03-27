import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getMembers } from "../members/firebaseMemberFunctions";

export const makeGroups = async (donutId: string): Promise<string[]> => {
  const groupIds: string[] = [];
  const members = await getMembers();
  const groupCollection = collection(db, "groups");
  let i = 0;

  while (i < members.length) {
    let groupSize = 3;

    if (members.length - i === 4) {
      groupSize = 4;
    }

    const groupMembers = members.slice(i, i + groupSize);
    i += groupSize;

    const groupDoc = await addDoc(groupCollection, {
      donutId: donutId,
      memberIds: groupMembers.map((member) => member.id),
    });

    const groupId = groupDoc.id;
    groupIds.push(groupId);

    for (const member of groupMembers) {
      const memberRef = doc(db, "members", member.id);
      await updateDoc(memberRef, {
        groupIds: arrayUnion(groupId),
      });
    }
  }

  return groupIds;
};
