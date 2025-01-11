import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Member } from "./Member";

export const addMember = async (memberData: any) => {
  await addDoc(collection(db, "members"), memberData);
};

export const getMembers = async (): Promise<Member[]> => {
  const membersCollection = collection(db, "members");
  const querySnapshot = await getDocs(membersCollection);

  const members: Member[] = querySnapshot.docs.map(
    (doc) => doc.data() as Member
  );

  return members;
};
