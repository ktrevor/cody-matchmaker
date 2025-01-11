import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Member } from "./Member";

export const updateLeaves = async (treeId: string, leafId: string) => {
  const treeRef = doc(db, "members", treeId);
  await updateDoc(treeRef, {
    leaves: arrayUnion(leafId),
  });
};

export const addMember = async (memberData: any) => {
  const docRef = await addDoc(collection(db, "members"), memberData);
  const { tree } = memberData;
  const newMemberId = docRef.id;

  if (tree) {
    await updateLeaves(tree, newMemberId);
  }
};

export const getMembers = async (): Promise<Member[]> => {
  const membersCollection = collection(db, "members");
  const querySnapshot = await getDocs(membersCollection);

  const members: Member[] = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();

      const tree = data.tree ? await getMemberById(data.tree) : null;

      const leaves = data.leaves
        ? await Promise.all(
            data.leaves.map((leaf: string) => getMemberById(leaf))
          )
        : [];

      return {
        id: doc.id,
        name: data.name,
        joined: data.joined,
        gender: data.gender,
        grade: data.grade,
        forest: data.forest,
        tree: tree,
        leaves: leaves,
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
    tree: memberData.tree,
    leaves: memberData.leaves,
  } as Member;
};
