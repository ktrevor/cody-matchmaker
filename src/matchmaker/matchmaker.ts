import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getMembers } from "../members/firebaseMemberFunctions";

const members = await getMembers();

export const makeGroups = async (): Promise<String[]> => {
  const groupIds: String[] = [];
  const groupSize = 3;

  const groupCollection = collection(db, "groups");

  for (let i = 0; i < members.length; i += groupSize) {
    const groupName = `Group ${Math.floor(i / groupSize) + 1}`;
    const groupMembers = members.slice(i, i + groupSize);

    const groupDoc = await addDoc(groupCollection, {
      name: groupName,
      memberIds: groupMembers.map((member) => member.id),
    });

    groupIds.push(groupDoc.id);
  }

  return groupIds;
};
