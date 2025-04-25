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
  const members = await getMembers();
  const groupCollection = collection(db, "groups");
  const groupIds: string[] = [];
  let i = 0;

  const groupPromises: Promise<void>[] = [];

  while (i < members.length) {
    let groupSize = 3;

    if (members.length - i === 4) {
      groupSize = 4;
    }

    const groupMembers = members.slice(i, i + groupSize);
    i += groupSize;

    const groupPromise = addDoc(groupCollection, {
      donutId: donutId,
      memberIds: groupMembers.map((member) => member.id),
    }).then(async (groupDoc) => {
      const groupId = groupDoc.id;
      groupIds.push(groupId);

      await Promise.all(
        groupMembers.map((member) =>
          updateDoc(doc(db, "members", member.id), {
            groupIds: arrayUnion(groupId),
          })
        )
      );
    });

    groupPromises.push(groupPromise);
  }

  await Promise.all(groupPromises);

  return groupIds;
};
