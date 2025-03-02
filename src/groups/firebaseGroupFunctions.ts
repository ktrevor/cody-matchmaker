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
  await updateDoc(donutRef, {
    groupIds: arrayUnion(firebaseGroupId),
  });

  return firebaseGroupId;
};

export const deleteGroup = async (group: Group): Promise<void> => {
  const donutRef = doc(db, "donuts", group.donutId);
  await updateDoc(donutRef, {
    groupIds: arrayRemove(group.id),
  });

  const groupRef = doc(db, "groups", group.id);
  await deleteDoc(groupRef);
};

export const deleteMemberFromGroup = async (
  group: Group,
  member: Member
): Promise<void> => {
  const groupRef = doc(db, "groups", group.id);
  await updateDoc(groupRef, {
    memberIds: arrayRemove(member.id),
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
};
