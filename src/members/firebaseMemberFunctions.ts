import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Member } from "./Member";
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
    joined: memberData.joined,
    gender: memberData.gender,
    grade: memberData.grade,
    forest: memberData.forest,
    treeId: memberData.treeId,
  } as Member;
};
