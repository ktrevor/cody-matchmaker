import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getNextGrade, Member } from "./Member";
import { MemberFormFields } from "../pages/MemberPage/MemberForm";

export const addMember = async (memberData: MemberFormFields) => {
  await addDoc(collection(db, "members"), memberData);
};

export const editMember = async (
  oldData: Member,
  newData: MemberFormFields
) => {
  const memberRef = doc(db, "members", oldData.id);

  const updatedFields: Partial<MemberFormFields> = {};

  if (oldData.name !== newData.name) updatedFields.name = newData.name;
  if (oldData.slackId !== newData.slackId)
    updatedFields.slackId = newData.slackId;
  if (oldData.grade !== newData.grade) updatedFields.grade = newData.grade;
  if (oldData.gender !== newData.gender) updatedFields.gender = newData.gender;
  if (oldData.joined !== newData.joined) updatedFields.joined = newData.joined;
  if (oldData.forest !== newData.forest) updatedFields.forest = newData.forest;
  if (oldData.treeId !== newData.treeId) {
    updatedFields.treeId = newData.treeId;
  }

  if (Object.keys(updatedFields).length > 0) {
    await updateDoc(memberRef, updatedFields);
  }
};

export const deleteMember = async (member: Member) => {
  //delete from groups
  const groupsCollection = collection(db, "groups");
  const groupSnapshot = await getDocs(groupsCollection);

  const updateGroups = groupSnapshot.docs
    .filter((groupDoc) => groupDoc.data().memberIds.includes(member.id))
    .map(async (groupDoc) => {
      const groupRef = doc(db, "groups", groupDoc.id);
      const updatedMemberIds = groupDoc
        .data()
        .memberIds.filter((id: string) => id !== member.id);

      return updateDoc(groupRef, { memberIds: updatedMemberIds });
    });

  await Promise.all(updateGroups);

  //if tree update leaves
  const membersCollection = collection(db, "members");
  const treeQuery = query(membersCollection, where("treeId", "==", member.id));
  const treeSnapshot = await getDocs(treeQuery);

  const updateTress = treeSnapshot.docs.map(async (docSnap) => {
    const memberRef = doc(db, "members", docSnap.id);
    await updateDoc(memberRef, { treeId: null });
  });

  await Promise.all(updateTress);

  //delete member from members collection
  const memberRef = doc(db, "members", member.id);
  await deleteDoc(memberRef);
};

export const getMembers = async (): Promise<Member[]> => {
  const membersCollection = collection(db, "members");
  const querySnapshot = await getDocs(membersCollection);

  const members: Member[] = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const memberData = doc.data();

      return {
        id: doc.id,
        name: memberData.name,
        slackId: memberData.slackId,
        joined: memberData.joined,
        gender: memberData.gender,
        grade: memberData.grade,
        forest: memberData.forest,
        treeId: memberData.treeId,
      } as Member;
    })
  );

  return members;
};

export const getMemberById = async (memberId: string): Promise<Member> => {
  const memberRef = doc(db, "members", memberId);
  const memberSnap = await getDoc(memberRef);

  if (!memberSnap.exists()) {
    throw new Error(`Member with ID ${memberId} not found`);
  }

  const memberData = memberSnap.data();

  return {
    id: memberId,
    name: memberData.name,
    slackId: memberData.slackId,
    joined: memberData.joined,
    gender: memberData.gender,
    grade: memberData.grade,
    forest: memberData.forest,
    treeId: memberData.treeId,
  } as Member;
};

export const promoteMembersGrades = async (
  members: Member[]
): Promise<void> => {
  for (const member of members) {
    const memberRef = doc(db, "members", member.id);
    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
      throw new Error(`Member with ID ${member.id} not found`);
    }

    const currentGrade = memberSnap.data().grade;
    const nextGrade = getNextGrade(currentGrade);

    if (!nextGrade) {
      await deleteMember(member);
      continue;
    }

    await updateDoc(memberRef, { grade: nextGrade });
  }
};
