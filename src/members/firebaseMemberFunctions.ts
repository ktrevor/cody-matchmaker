import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const addMember = async (memberData: any) => {
  await addDoc(collection(db, "members"), memberData);
};
