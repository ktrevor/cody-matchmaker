import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Member } from "./Member";

export const addMember = async (memberData: any) => {
  await addDoc(collection(db, "members"), memberData);
};

export const getMembers = async (): Promise<Member[]> => {
  const membersCollection = collection(db, "members");
  const querySnapshot = await getDocs(membersCollection);

  const members: Member[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      joined: data.joined,
      gender: data.gender,
      grade: data.grade,
      forest: data.forest,
      tree: data.tree,
      leaves: data.leaves,
    } as Member;
  });

  return members;
};
