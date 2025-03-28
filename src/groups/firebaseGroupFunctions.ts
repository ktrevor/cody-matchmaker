import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
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
    donutId: groupData.donutId,
    members: members,
  } as Group;
};

export const addGroup = async (group: Group): Promise<string> => {
  const groupRef = await addDoc(collection(db, "groups"), {
    donutId: group.donutId,
    memberIds: [],
  });

  const firebaseGroupId = groupRef.id;

  const donutRef = doc(db, "donuts", group.donutId);
  const updateDonut = updateDoc(donutRef, {
    groupIds: arrayUnion(firebaseGroupId),
  });

  await updateDonut;

  return firebaseGroupId;
};

export const deleteGroup = async (group: Group): Promise<void> => {
  const donutRef = doc(db, "donuts", group.donutId);
  const groupRef = doc(db, "groups", group.id);

  const removeFromDonut = updateDoc(donutRef, {
    groupIds: arrayRemove(group.id),
  });

  const removeFromMembers = group.members.map((member) =>
    updateDoc(doc(db, "members", member.id), {
      groupIds: arrayRemove(group.id),
    })
  );

  const deleteGroupDoc = deleteDoc(groupRef);

  await Promise.all([removeFromDonut, ...removeFromMembers, deleteGroupDoc]);
};

export const deleteMemberFromGroup = async (
  group: Group,
  member: Member
): Promise<void> => {
  const groupRef = doc(db, "groups", group.id);
  await updateDoc(groupRef, {
    memberIds: arrayRemove(member.id),
  });

  const memberRef = doc(db, "members", member.id);
  await updateDoc(memberRef, {
    groupIds: arrayRemove(group.id),
  });
};
export const addMemberToGroup = async (
  group: Group,
  member: Member
): Promise<void> => {
  const groupRef = doc(db, "groups", group.id);
  await updateDoc(groupRef, {
    memberIds: arrayUnion(member.id),
  });

  const memberRef = doc(db, "members", member.id);
  await updateDoc(memberRef, {
    groupIds: arrayUnion(group.id),
  });
};
